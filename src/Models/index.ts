export * from './event.model';
export * from './props.model';

export const getOptions: RequestInit = {
  method: "GET",
  headers: { "Content-Type": "application/json" },
  mode: "cors"
};

export const postOptions: RequestInit = {
  method: "POST",
  headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  mode: "cors"
}
export const postFileOptions: any = (type: string, size: string) => {
  return {
    method: "POST",
    headers: {
      'content-type': type,
      'content-length': `${size}`
    },
    mode: "cors"
  }
}