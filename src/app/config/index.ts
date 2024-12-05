import dotenv from 'dotenv';

import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });


// TODO:change all the nessary thing there like implement refresh token there
export default {
  node_Env: "development",
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  access_secret_key:process.env.JWT_ACCESS_TOKEN,
  JWT_ACCESS_EXPIRES_IN:process.env.JWT_ACCESS_TOKEN,
  refresh_secret_key:process.env.JWT_ACCESS_TOKEN,
  JWT_REFRESH_EXPIRES_IN:process.env.JWT_ACCESS_TOKEN ,
  bcrypt_salt_round:10,
  reset_pass_ui_link:'htt'
};