'use strict';



const MyPG = require('pg');



class CRDBConnection {



    #MyClientConn;



    constructor(ClientConn) {
        this.#MyClientConn = ClientConn;

    };



    SetErrorHandler(errFunc) {
        this.#MyClientConn.on('error', errFunc);
    }



    RunSQL(SQL) {
        return new Promise((resolve, reject) => {
            this.#MyClientConn.query(SQL, (err, SQLResult) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(SQLResult);
                };
            });
        });
    };



    Release() {
        return this.#MyClientConn.release();
    };
};



class CRDBPool {
    #MyPool;


    constructor(myConfig) {
        this.#MyPool = new MyPG.Pool(myConfig);
    };



    async CreateConnection() {
        const myClientConn = await this.#MyPool.connect();
        return new CRDBConnection(myClientConn);
    };



    End() {
        return this.#MyPool.end();
    };
};



exports.CreatePoolUsingCS = async ConnectionString => {
    const myConfig = {
        connectionString: ConnectionString,
        ssl: {
            rejectUnauthorized: false,
            ca: null
        }
    };

    return new CRDBPool(myConfig);
};
