const express = require('express');
const app = express();
const port = 3000;
const OpenAI = require("openai");
require('dotenv').config();
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(__dirname)); 

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

const data = ['Item 1', 'Item 2', 'Item 3'];

app.get('/get-data', (req, res) => {
    // Simulate fetching data from a database or an external API
    res.json(data);
  });

  app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
  })

  app.post('/parking', async (req, res) => {
    var blobUrl = req.body.imageUrl;
    res.json(gpt(blobUrl));
  });

  async function gpt(blob) {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Based on your most recent knowledge of parking signs in Vancouver, Candada, interpret this image of a parking sign and describe the law it lays out. Be clear about timings and durations, e.g., Public parking only between 3-5pm. Your job is to help a driver determine if they can use the spot as a public parking spot and if so what the restrictions are." },
            {
              type: "image_url",
              image_url: blob,
            },
          ],
        },
      ],
    });
    console.log(response.choices[0]);
  }
  