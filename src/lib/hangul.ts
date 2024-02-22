export { Hangul }
namespace Hangul {
    let CHO = [
            'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ',
            'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ',
            'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ',
            'ㅍ', 'ㅎ'
        ],
        JUNG = [
            'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ',
            'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', ['ㅗ', 'ㅏ'], ['ㅗ', 'ㅐ'],
            ['ㅗ', 'ㅣ'], 'ㅛ', 'ㅜ', ['ㅜ', 'ㅓ'], ['ㅜ', 'ㅔ'], ['ㅜ', 'ㅣ'],
            'ㅠ', 'ㅡ', ['ㅡ', 'ㅣ'], 'ㅣ'
        ],
        JONG = [
            '', 'ㄱ', 'ㄲ', ['ㄱ', 'ㅅ'], 'ㄴ', ['ㄴ', 'ㅈ'], ['ㄴ', 'ㅎ'], 'ㄷ', 'ㄹ',
            ['ㄹ', 'ㄱ'], ['ㄹ', 'ㅁ'], ['ㄹ', 'ㅂ'], ['ㄹ', 'ㅅ'], ['ㄹ', 'ㅌ'], ['ㄹ', 'ㅍ'], ['ㄹ', 'ㅎ'], 'ㅁ',
            'ㅂ', ['ㅂ', 'ㅅ'], 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
        ],
        HANGUL_OFFSET = 0xAC00,
        CONSONANTS = [
            'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄸ',
            'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ',
            'ㅁ', 'ㅂ', 'ㅃ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ',
            'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
        ],
        COMPLETE_CHO = [
            'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ',
            'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ',
            'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
        ],
        COMPLETE_JUNG = [
            'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ',
            'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ',
            'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ',
            'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
        ],
        COMPLETE_JONG = [
            '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ',
            'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ',
            'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
        ],
        COMPLEX_CONSONANTS = [
            ['ㄱ', 'ㅅ', 'ㄳ'],
            ['ㄴ', 'ㅈ', 'ㄵ'],
            ['ㄴ', 'ㅎ', 'ㄶ'],
            ['ㄹ', 'ㄱ', 'ㄺ'],
            ['ㄹ', 'ㅁ', 'ㄻ'],
            ['ㄹ', 'ㅂ', 'ㄼ'],
            ['ㄹ', 'ㅅ', 'ㄽ'],
            ['ㄹ', 'ㅌ', 'ㄾ'],
            ['ㄹ', 'ㅍ', 'ㄿ'],
            ['ㄹ', 'ㅎ', 'ㅀ'],
            ['ㅂ', 'ㅅ', 'ㅄ']
        ],
        COMPLEX_VOWELS = [
            ['ㅗ', 'ㅏ', 'ㅘ'],
            ['ㅗ', 'ㅐ', 'ㅙ'],
            ['ㅗ', 'ㅣ', 'ㅚ'],
            ['ㅜ', 'ㅓ', 'ㅝ'],
            ['ㅜ', 'ㅔ', 'ㅞ'],
            ['ㅜ', 'ㅣ', 'ㅟ'],
            ['ㅡ', 'ㅣ', 'ㅢ']
        ];

    function _makeHash(array: string[]): { [key: number]: number } {
        let length = array.length;
        let hash: { [key: number]: number } = { 0: 0 };
        for (let i = 0; i < length; i++) {
        if (array[i]) hash[array[i].charCodeAt(0)] = i;
        }
        return hash;
    }
    function _makeComplexHash(array: (string | string[])[]): { [key: number]: { [key: number]: number } } {
        let length = array.length;
        let hash: { [key: number]: { [key: number]: number } } = {},
                code1:number,
                code2:number;
        for (var i = 0; i < length; i++) {
            code1 = array[i][0].charCodeAt(0);
            code2 = array[i][1].charCodeAt(0);
            if (typeof hash[code1] === 'undefined') {
                hash[code1] = {}; // Fix: Initialize as an empty object
            }
            hash[code1][code2] = array[i][2].charCodeAt(0);
        }
        return hash;
    }
    let CONSONANTS_HASH: { [key: number]: number } = _makeHash(CONSONANTS);
    let CHO_HASH: { [key: number]: number } = _makeHash(COMPLETE_CHO);
    let JUNG_HASH: { [key: number]: number } = _makeHash(COMPLETE_JUNG);
    let JONG_HASH: { [key: number]: number } = _makeHash(COMPLETE_JONG);
    let COMPLEX_CONSONANTS_HASH: { [key: number]: { [key: number]: number } } = _makeComplexHash(COMPLEX_CONSONANTS);
    let COMPLEX_VOWELS_HASH: { [key: number]: { [key: number]: number } } =  _makeComplexHash(COMPLEX_VOWELS);


    function _isConsonant(c: number):boolean {
        return typeof CONSONANTS_HASH[c] !== 'undefined';
    }

    function _isCho(c: number):boolean {
        return typeof CHO_HASH[c] !== 'undefined';
    }

    function _isJung(c: number):boolean {
        return typeof JUNG_HASH[c] !== 'undefined';
    }

    function _isJong(c: number):boolean {
        return typeof JONG_HASH[c] !== 'undefined';
    }

    function _isHangul(c: number):boolean {
        return 0xAC00 <= c && c <= 0xd7a3;
    }

    function _isJungJoinable(a:number, b:number):number | boolean {
        return (COMPLEX_VOWELS_HASH[a] && COMPLEX_VOWELS_HASH[a][b]) ? COMPLEX_VOWELS_HASH[a][b] : false;
    }

    function _isJongJoinable(a:number, b:number):number | boolean {
        return COMPLEX_CONSONANTS_HASH[a] && COMPLEX_CONSONANTS_HASH[a][b] ? COMPLEX_CONSONANTS_HASH[a][b] : false;
    }

    export const disassemble = function (string: string | string[], grouped?:boolean) {
        if (string === null) {
            throw new Error('Arguments cannot be null');
        }

        if (Array.isArray(string)) {
            string = string.join('');
        }

        var result:any[] = [],
            length = string.length,
            cho:number,
            jung,
            jong,
            code,
            r
            ;

        for (var i = 0; i < length; i++) {
            var temp:any[] = [];

            code = string.charCodeAt(i);
            if (_isHangul(code)) { // 완성된 한글이면
                code -= HANGUL_OFFSET;
                jong = code % 28;
                jung = (code - jong) / 28 % 21;
                cho = Number(((code - jong) / 28 / 21).toFixed(0));
                temp.push(CHO[cho]);
                if (typeof JUNG[jung] === 'object') {
                    temp = temp.concat(JUNG[jung]);
                } else {
                    temp.push(JUNG[jung]);
                }
                if (jong > 0) {
                    if (typeof JONG[jong] === 'object') {
                        temp = temp.concat(JONG[jong]);
                    } else {
                        temp.push(JONG[jong]);
                    }
                }
            } else if (_isConsonant(code)) { //자음이면
                if (_isCho(code)) {
                    r = CHO[CHO_HASH[code]];
                } else {
                    r = JONG[JONG_HASH[code]];
                }
                if (typeof r === 'string') {
                    temp.push(r);
                } else {
                    temp = temp.concat(r);
                }
            } else if (_isJung(code)) {
                r = JUNG[JUNG_HASH[code]];
                if (typeof r === 'string') {
                    temp.push(r);
                } else {
                    temp = temp.concat(r);
                }
            } else {
                temp.push(string.charAt(i));
            }

            if (grouped) result.push(temp);
            else result = result.concat(temp);
        }

        return result;
    };

    export const disassembleToString = function (str:string | string[]) {
        if (typeof str !== 'string') {
            return '';
        }
        str = disassemble(str);
        return str.join('');
    };

    export const assemble = function (array:string | string[]) {
        if (typeof array === 'string') {
            array = disassemble(array);
        }

        var result:any[] = [],
            length = array.length,
            code,
            stage = 0,
            complete_index = -1, //완성된 곳의 인덱스
            previous_code,
            jong_joined = false
            ;

        function _makeHangul(index:number) { // complete_index + 1부터 index까지를 greedy하게 한글로 만든다.
            var code,
                cho,
                jung1,
                jung2,
                jong1 = 0,
                jong2,
                hangul = ''
                ;

            jong_joined = false;
            if (complete_index + 1 > index) {
                return;
            }
            for (var step = 1; ; step++) {
                if (step === 1) {
                    cho = array[complete_index + step].charCodeAt(0);
                    if (_isJung(cho)) { // 첫번째 것이 모음이면 1) ㅏ같은 경우이거나 2) ㅙ같은 경우이다
                        if (complete_index + step + 1 <= index && _isJung(jung1 = array[complete_index + step + 1].charCodeAt(0))) { //다음것이 있고 모음이면
                            result.push(String.fromCharCode(_isJungJoinable(cho, jung1) as number));
                            complete_index = index;
                            return;
                        } else {
                            result.push(array[complete_index + step]);
                            complete_index = index;
                            return;
                        }
                    } else if (!_isCho(cho)) {
                        result.push(array[complete_index + step]);
                        complete_index = index;
                        return;
                    }
                    hangul = array[complete_index + step];
                } else if (step === 2) {
                    jung1 = array[complete_index + step].charCodeAt(0);
                    if (_isCho(jung1)) { //두번째 또 자음이 오면 ㄳ 에서 ㅅ같은 경우이다
                        cho = _isJongJoinable(cho as number, jung1);
                        hangul = String.fromCharCode(cho as number);
                        result.push(hangul);
                        complete_index = index;
                        return;
                    } else {
                        hangul = String.fromCharCode((CHO_HASH[cho as number] * 21 + JUNG_HASH[jung1]) * 28 + HANGUL_OFFSET);
                    }
                } else if (step === 3) {
                    jung2 = array[complete_index + step].charCodeAt(0);
                    if (_isJungJoinable(jung1 as number, jung2)) {
                        jung1 = _isJungJoinable(jung1 as number, jung2);
                    } else {
                        jong1 = jung2;
                    }
                    hangul = String.fromCharCode((CHO_HASH[cho as number] * 21 + JUNG_HASH[jung1 as number]) * 28 + JONG_HASH[jong1] + HANGUL_OFFSET);
                    
                } else if (step === 4) {
                    jong2 = array[complete_index + step].charCodeAt(0);
                    if (_isJongJoinable(jong1, jong2)) {
                        jong1 = _isJongJoinable(jong1, jong2) as number;
                    } else {
                        jong1 = jong2;
                    }
                    hangul = String.fromCharCode((CHO_HASH[cho as number] * 21 + JUNG_HASH[jung1 as number]) * 28 + JONG_HASH[jong1] + HANGUL_OFFSET);
                } else if (step === 5) {
                    jong2 = array[complete_index + step].charCodeAt(0);
                    jong1 = _isJongJoinable(jong1, jong2) as number;
                    hangul = String.fromCharCode((CHO_HASH[cho as number] * 21 + JUNG_HASH[jung1 as number]) * 28 + JONG_HASH[jong1] + HANGUL_OFFSET);
                }

                if (complete_index + step >= index) {
                    result.push(hangul);
                    complete_index = index;
                    return;
                }
            }
        }

        for (var i = 0; i < length; i++) {
            code = array[i].charCodeAt(0);
            if (!_isCho(code) && !_isJung(code) && !_isJong(code)) { //초, 중, 종성 다 아니면
                _makeHangul(i - 1);
                _makeHangul(i);
                stage = 0;
                continue;
            }
            
            if (stage === 0) { // 초성이 올 차례
                if (_isCho(code)) { // 초성이 오면 아무 문제 없다.
                    stage = 1;
                } else if (_isJung(code)) {
                    // 중성이오면 ㅐ 또는 ㅘ 인것이다. 바로 구분을 못한다. 따라서 특수한 stage인 stage4로 이동
                    stage = 4;
                }
            } else if (stage == 1) { //중성이 올 차례
                if (_isJung(code)) { //중성이 오면 문제없음 진행.
                    stage = 2;
                } else { //아니고 자음이오면 ㄻ같은 경우가 있고 ㄹㅋ같은 경우가 있다.
                    if (_isJongJoinable(previous_code as number, code)) {
                        // 합쳐질 수 있다면 ㄻ 같은 경우인데 이 뒤에 모음이 와서 ㄹ마 가 될수도 있고 초성이 올 수도 있다. 따라서 섣불리 완성할 수 없다. 이땐 stage5로 간다.
                        stage = 5;
                    } else { //합쳐질 수 없다면 앞 글자 완성 후 여전히 중성이 올 차례
                        _makeHangul(i - 1);
                    }
                }
            } else if (stage == 2) { //종성이 올 차례
                if (_isJong(code)) { //종성이 오면 다음엔 자음 또는 모음이 온다.
                    stage = 3;
                } else if (_isJung(code)) { //그런데 중성이 오면 앞의 모음과 합칠 수 있는지 본다.
                    if (_isJungJoinable(previous_code as number, code)) { //합칠 수 있으면 여전히 종성이 올 차례고 그대로 진행
                    } else { // 합칠 수 없다면 오타가 생긴 경우
                        _makeHangul(i - 1);
                        stage = 4;
                    }
                } else { // 받침이 안되는 자음이 오면 ㄸ 같은 이전까지 완성하고 다시시작
                    _makeHangul(i - 1);
                    stage = 1;
                }
            } else if (stage == 3) { // 종성이 하나 온 상태.
                if (_isJong(code)) { // 또 종성이면 합칠수 있는지 본다.
                    if (!jong_joined && _isJongJoinable(previous_code as number, code)) { //합칠 수 있으면 계속 진행. 왜냐하면 이번에 온 자음이 다음 글자의 초성이 될 수도 있기 때문. 대신 이 기회는 한번만
                        jong_joined = true;
                    } else { //없으면 한글자 완성
                        _makeHangul(i - 1);
                        stage = 1; // 이 종성이 초성이 되고 중성부터 시작
                    }
                } else if (_isCho(code)) { // 초성이면 한글자 완성.
                    _makeHangul(i - 1);
                    stage = 1; //이 글자가 초성이되므로 중성부터 시작
                } else if (_isJung(code)) { // 중성이면 이전 종성은 이 중성과 합쳐지고 앞 글자는 받침이 없다.
                    _makeHangul(i - 2);
                    stage = 2;
                }
            } else if (stage == 4) { // 중성이 하나 온 상태
                if (_isJung(code)) { //중성이 온 경우
                    if (_isJungJoinable(previous_code as number, code)) { //이전 중성과 합쳐질 수 있는 경우
                        _makeHangul(i);
                        stage = 0;
                    } else { //중성이 왔지만 못합치는 경우. ㅒㅗ 같은
                        _makeHangul(i - 1);
                    }
                } else { // 아니면 자음이 온 경우.
                    _makeHangul(i - 1);
                    stage = 1;
                }
            } else if (stage == 5) { // 초성이 연속해서 두개 온 상태 ㄺ
                if (_isJung(code)) { //이번에 중성이면 ㄹ가
                    _makeHangul(i - 2);
                    stage = 2;
                } else {
                    _makeHangul(i - 1);
                    stage = 1;
                }
            }
            previous_code = code;
        }
        _makeHangul(i - 1);
        return result.join('');
    };

    export const search = function (a: string | string[], b: string | string[]) {
        var ad = disassemble(a).join(''),
            bd = disassemble(b).join('')
            ;

        return ad.indexOf(bd);
    };

    export const rangeSearch = function (haystack: string | string[], needle: string | string[]) {
        var hex = disassemble(haystack).join(''),
            nex = disassemble(needle).join(''),
            grouped = disassemble(haystack, true),
            re = new RegExp(nex, 'gi'),
            indices = [],
            result;

        if (!needle.length) return [];

        while ((result = re.exec(hex))) {
            indices.push(result.index);
        }

        function findStart(index:number) {
            for (var i = 0, length = 0; i < grouped.length; ++i) {
                length += grouped[i].length;
                if (index < length) return i;
            }
        }

        function findEnd(index:number) {
            for (var i = 0, length = 0; i < grouped.length; ++i) {
                length += grouped[i].length;
                if (index + nex.length <= length) return i;
            }
        }

        return indices.map(function (i) {
            return [findStart(i), findEnd(i)];
        });
    };
    export class Searcher {
        string:string;
        disassembled:string;
        constructor(string:string) {
            this.string = string;
            this.disassembled = disassemble(string).join('');
        }
        search(string:string):number {
            return disassemble(string).join('').indexOf(this.disassembled);
        }
    }

    Searcher.prototype.search = function (string):number {
        return disassemble(string).join('').indexOf(this.disassembled);
    };
    export const endsWithConsonant = function (string: string | string[]) {
        if (typeof string === 'object') {
            string = string.join('');
        }

        var code = string.charCodeAt(string.length - 1);

        if (_isHangul(code)) { // 완성된 한글이면
            code -= HANGUL_OFFSET;
            var jong = code % 28;
            if (jong > 0) {
                return true;
            }
        } else if (_isConsonant(code)) { //자음이면
            return true;
        }
        return false;
    };

    export const endsWith = function (string:string | string[], target:string | string[]):boolean {
        return disassemble(string).pop() === target;
    };

    export const ds = disassembleToString;
    export const a = assemble;


    export const isHangul = function (c: string | number):boolean {
            if (typeof c === 'string')
            c = c.charCodeAt(0);
        return _isHangul(c);
    }
    export const isComplete  = function (c: string | number):boolean {
        if (typeof c === 'string')
            c = c.charCodeAt(0);
        return _isHangul(c);
    }
    export const isConsonant = function (c: string | number):boolean {
        if (typeof c === 'string')
            c = c.charCodeAt(0);
        return _isConsonant(c);
    }
    export const isVowel = function (c: string | number):boolean {
        if (typeof c === 'string')
            c = c.charCodeAt(0);
        return _isJung(c);
    }
    export const isCho = function (c: string | number):boolean {
        if (typeof c === 'string')
            c = c.charCodeAt(0);
        return _isCho(c);
    }
    export const isJong = function (c: string | number):boolean {
        if (typeof c === 'string')
            c = c.charCodeAt(0);
        return _isJong(c);
    }
    export const isHangulAll = function (string: string):boolean {
        if (typeof string !== 'string') {
            return false;
        }
        for (var i = 0; i < string.length; i++) {
            if (!_isHangul(string.charCodeAt(i))) return false;
        }
        return true;
    }

    export const isCompleteAll = function (string: string):boolean {
        if (typeof string !== 'string') {
            return false;
        }
        for (var i = 0; i < string.length; i++) {
            if (!_isHangul(string.charCodeAt(i))) return false;
        }
        return true;
    }
    export const isConsonantAll = function (string: string):boolean {
        if (typeof string !== 'string') {
            return false;
        }
        for (var i = 0; i < string.length; i++) {
            if (!_isConsonant(string.charCodeAt(i))) return false;
        }
        return true;
    }
    export const isVowelAll = function (string: string):boolean {
        if (typeof string !== 'string') {
            return false;
        }
        for (var i = 0; i < string.length; i++) {
            if (!_isJung(string.charCodeAt(i))) return false;
        }
        return true;
    }
    export const isChoAll = function (string: string):boolean {
        if (typeof string !== 'string') {
            return false;
        }
        for (var i = 0; i < string.length; i++) {
            if (!_isCho(string.charCodeAt(i))) return false;
        }
        return true;
    }
    export const isJongAll = function (string: string):boolean {
        if (typeof string !== 'string') {
            return false;
        }
        for (var i = 0; i < string.length; i++) {
            if (!_isJong(string.charCodeAt(i))) return false;
        }
        return true;
    }   
}