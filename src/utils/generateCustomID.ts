function generateCustomID(prefix = '') {
    const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const LENGTH = 34;
    let result = prefix;
  
    for (let i = 0; i < LENGTH; i++) {
      const randomIndex = Math.floor(Math.random() * ALPHANUMERIC.length);
      result += ALPHANUMERIC[randomIndex];
    }
  
    return result;
}
  
export default generateCustomID;  