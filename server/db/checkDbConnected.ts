import mysql from "./db.ts";

const checkDbConnected = async () => {
  const num1 = 2;
  const num2 = 3;

  const result = await mysql.query("SELECT ? + ? AS sum", [num1, num2]);
  return result[0].sum === num1 + num2;
};

export default checkDbConnected;
