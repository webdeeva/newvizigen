# AI Image Generator

AI Image Generator is a powerful web application that allows users to create stunning AI-generated images using various models from Replicate. This project is built with Next.js, React, and Tailwind CSS, providing a modern and responsive user interface.

## Features

### Current Features

1. **Image Generation**: Users can generate AI images using the Replicate API.
2. **Multiple AI Models**: Support for multiple AI models including Flux Dev, Flux Schnell, and Flux Pro.
3. **Customizable Parameters**: Users can adjust various parameters for image generation:
   - Aspect Ratio
   - Guidance Scale
   - Number of Outputs
   - Safety Checker Toggle
4. **Responsive Design**: A mobile-friendly interface that works well on various screen sizes.
5. **Dark Mode**: Built-in dark mode support for better user experience in different lighting conditions.

### Planned Features

1. **User Authentication**: Implement user accounts and authentication system.
2. **Credit System**: Introduce a credit-based system for image generation.
3. **Public Image Gallery**: Create a searchable gallery of publicly shared generated images.
4. **User Dashboard**: Develop a personal dashboard for users to manage their generated images.
5. **Admin Panel**: Build an admin interface for user management and prompt customization.
6. **Prompt Generator**: Implement an AI-assisted prompt generator to help users create better prompts.
7. **OpenAI Integration**: Add functionality to enhance prompts using OpenAI's language models.
8. **Save and Share**: Allow users to save their generated images and share them publicly or privately.
9. **Community Features**: Implement social features like comments, likes, and follows.

## Getting Started

To run this project locally:

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env.local` file and add your Replicate API key:
   ```
   REPLICATE_API_TOKEN=your_api_key_here
   ```
4. Run the development server with `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technologies Used

- Next.js
- React
- Tailwind CSS
- shadcn/ui
- Replicate API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).