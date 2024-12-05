
import { Server } from 'http';
import app from './app';
let server: Server;
const port =3000

async function main() {
    const server:Server =app.listen(port,()=>{
        console.log(`app is listening on port ${port}`);
    }) 
}

main()


process.on('unhandledRejection', (err) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});