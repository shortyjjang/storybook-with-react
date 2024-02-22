import axios from 'axios';
import Cookies from 'js-cookie';

export const A2dApi = {
  post: async function (url: string, data: any = {}, useToken:boolean = true) {
    if(navigator.onLine === false) return {
      code: 9999,
      result: 'fail',
      resultMsg: '인터넷이 연결되어 있지 않습니다.'
    };
    const request:A2dApiResponse = await Api.post(url, data,{
      headers: useToken? {
        Authorization: Cookies.get('accessToken')
      }: {}})
      if(request?.meta?.code === 1103) {
        window.location.href = '/logout'
      }
    if(request?.meta?.result !== 'ok' && request?.meta.resultMsg) return request?.meta
    if(request?.content) return request.content
    return request
  },
  get: async function (url: string, data: any = {}, useToken:boolean = true) {
    if(navigator.onLine === false) return;
    if(!Cookies.get('accessToken') && useToken) {
      Cookies.remove('userSetting')
      return {
        resultMsg: '로그인이 필요합니다.',
        href:  '/logout'
      }
    }
    const request:A2dApiResponse = await Api.get(url, {
      params: data,
      headers: useToken? {
        Authorization: Cookies.get('accessToken')
      }: {}
    })
    if(request?.meta?.code === 1103) {
      window.location.href = '/logout'
    }
    if(request?.meta.result !== 'ok' && request?.meta.resultMsg) return request?.meta
    if(request?.content) return request.content
    return request
  }
};

export const Api = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? 'https://qa-smart-api.a2dcorp.co.kr':'https://smart-api.a2dcorp.co.kr',
    timeout: 60000,
    params: {
    },
    withCredentials: true,
});

// Api.interceptors.request.use(
//   (config) => {
//     config.headers.Authorization = Cookies.get('accessToken');
//     return config;
//   }
// )
Api.interceptors.response.use(
    async (response) => {
      if(response?.data?.meta?.result === 'tokenRefresh') {
        Cookies.set('accessToken', JSON.parse(response.data.content).token);
        if(Cookies.get('userSetting')) Cookies.set('userSetting', Cookies.get('userSetting') || '', { expires: 1 });
        let originalRequest = response.config;
        originalRequest.headers.Authorization = JSON.parse(response.data.content).token;
        const res:A2dApiResponse = await Api.request(originalRequest);
        return res;
      }
      return response?.data || response
    },
  
    async (error) => {
      if(error.response?.data?.meta?.result === 'tokenRefresh') {
        Cookies.set('accessToken', JSON.parse(error.response.data.content).token);
        let originalRequest = error.response.config;
        originalRequest.headers.Authorization = JSON.parse(error.response.data.content).token;
        const res:A2dApiResponse = await Api.request(originalRequest);
        return res;
      }
      if(Cookies.get('userSetting')) {
        const loginId = JSON.parse(Cookies.get('userSetting') || '').loginId;
        await A2dApi.post('/api/v1/store/error', {
          loginId: loginId,
          selJson: JSON.stringify({
            errorInfo: JSON.stringify(error),
            errorType: 'API오류'
          })
        })
      }
      if(error.code === 'ECONNABORTED' ||  error.response?.status === 408) {
        return {
          isOk: false,
          meta: {
            code: 9999,
            result: 'fail',
            resultMsg: '요청시간이 초괴되었습니다.\n잠시 후 다시 시도해주세요.'
          }
        }
      }
      if(!error.response?.data?.isOk && error.response?.data?.meta?.resultMsg) {
        return error.response.data
      }
      return {
        isOk: false,
        meta: {
          code: 9999,
          result: 'fail',
          resultMsg: '네트워크에 문제가 발생했습니다.'
        }
      }
    }
);

interface A2dApiResponse {
  content: any
  meta: {
    code: number
    result: string
    resultMsg: string
  }
  ok: boolean
}


