declare module "sql.js" {
  export interface QueryExecResult {
    columns: string[];
    values: any[][];
  }

  export interface Database {
    exec(sql: string, params?: any[]): QueryExecResult[];
    run(sql: string, params?: any[]): Database;
    getRowsModified(): number;
    export(): Uint8Array;
    close(): void;
    create_function(name: string, func: (...args: any[]) => any): void;
  }

  export interface SqlJsStatic {
    Database: new (data?: ArrayLike<number> | Buffer | null) => Database;
  }

  interface InitSqlJsConfig {
    locateFile?: (fileName: string) => string;
  }

  type InitSqlJs = (config?: InitSqlJsConfig) => Promise<SqlJsStatic>;

  const initSqlJs: InitSqlJs;
  export default initSqlJs;
}
