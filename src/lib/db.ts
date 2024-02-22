import { IDBPDatabase, openDB } from "idb";

//인덱스DB 사용하기
class IndexedDb {
  private database: string;
  private db: any;

  constructor(database: string) {
    this.database = database;
  }

  //DB 생성
  public async createObjectStore(tableNames: string[]) {
    try {
      this.db = await openDB(this.database, 1, {
        upgrade(db: IDBPDatabase) {
          for (const tableName of tableNames) {
            //테이블이 존재하면 넘어가기
            if (db.objectStoreNames.contains(tableName)) {
              continue;
            }
            //테이블 생성
            db.createObjectStore(tableName);
          }
        },
      });
    } catch (error) {
      return false;
    }
  }

  public async getValue(tableName: string, id: number | string) {
    //읽기 전용 트랜잭션
    const tx = this.db?.transaction(tableName, "readonly");
    if(!tx) return;

    //테이블 가져오기
    const store = tx.objectStore(tableName);

    //테이블내 id로 검색
    const result = await store.get(id);
    return result;
  }

  public async getAllValue(tableName: string) {
    //읽기 전용 트랜잭션
    const tx = this.db?.transaction(tableName, "readonly");
    if(!tx) return;

    //테이블 가져오기
    const store = tx.objectStore(tableName);

    //저정된 모든 데이터 가져오기
    const result = await store.getAll();
    return result;
  }

  public async putValue(
    tableName: string,
    value: object,
    key: string | number
  ) {
    //읽기 쓰기 트랜잭션
    const tx = this.db.transaction(tableName, "readwrite");
    if(!tx) return;

    //테이블 가져오기
    const store = tx.objectStore(tableName);
    if(!store?.put) return;
    //데이터 저장
    const result = await store.put(value, key);
    return result;
  }

  public async deleteValue(tableName: string, id: number | string) {
    //읽기 쓰기 트랜잭션
    const tx = this.db.transaction(tableName, "readwrite");
    if(!tx) return;

    //테이블 가져오기
    const store = tx.objectStore(tableName);
    const result = await store.get(id);
    //데이터가 없으면 종료
    if (!result) {
      return result;
    }

    //데이터 삭제
    await store.delete(id);
    return id;
  }

  public async deleteAllValue(tableName: string) {
    //읽기 쓰기 트랜잭션
    const tx = this.db.transaction(tableName, "readwrite");
    if(!tx) return;

    //테이블 가져오기
    const store = tx.objectStore(tableName);
    
    //테이블 내 모든 데이터 삭제
    if (store) {
      await store.clear();
    }
    return;
  }
}

export default IndexedDb;


export const indexedDb = new IndexedDb('A2DPOS');
