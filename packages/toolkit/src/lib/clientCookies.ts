export const clientCookieSet = (cname: string, cvalue: string, exdays: number = 30) => {
  const d = new Date();
  
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  
  const expires = "expires="+ d.toUTCString();
  
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export const clientCookieGet = (cname: string) => {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];

    if (!c) {
      continue;
    }

    c = c.trim();
    
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  
  return null;
}