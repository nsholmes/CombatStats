export const fetchIntercept = async (
  dispatch: any,
  done: any,
  url: string,
  options: RequestInit,
  canFail?: boolean,
  nonJson?: boolean) => {
  const retVal = await fetch(url, options)
    .then(async (resp) => {
      if (dispatch) { console.log("dispatch was passed!") }
      const responseData = await resp.json();
      return responseData;
    })
    .catch((err) => {
      console.log(canFail, nonJson)
      console.warn("FETCH INTERCEPT FAILED!!! ", err);
      return null
    })
  done();
  return retVal;
}