const axios = require("axios");

const chatbotController = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer YOUR_API_KEY`,
          "Content-Type": "application/json",
        },
      }
    );

    const chatbotReply = response.data.choices[0].message.content;
    res.status(200).json({ reply: chatbotReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Có lỗi xảy ra khi gọi API chatbot" });
  }
};

module.exports = chatbotController;
