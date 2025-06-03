export const generatePassword = () => {
  var passwd = "";
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < 10; i++) {
    var c = Math.floor(Math.random() * chars.length + 1);
    passwd += chars.charAt(c);
  }

  return passwd;
};
