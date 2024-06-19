import { create } from 'venom-bot';
import { stages, getStage } from './stages.js';
import express from 'express';
const port = process.env.PORT || 4000;

const app = express();
app.get("/", (req, res) => {
    res.send("hello");
});

create().then((client) => {
    client.on('qr',(q)=>{
        console.log(q);
    });
    start(client);
});

async function start(client) {
  await client.onMessage(async (message) => {
    try {
      const currentStage = getStage({ from: message.from });

      const messageResponse = stages[currentStage].stage.exec({
        from: message.from,
        message: message.body,
        client,
      });

      if (messageResponse) {
        await client.sendText(message.from, messageResponse);
      }
    } catch (error) {
      client.close();
    }
  });

process.on('SIGINT', function () {
    client.close();
  });
}

app.listen(port,()=>{
  console.log(`app listening on ${port}`);
});
