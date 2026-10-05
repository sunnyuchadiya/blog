import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { Blog } from './models/Blog.js';

import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Seed static Admin and 6 Rich Actual Editorial Blogs
const seedDatabase = async () => {
  try {
    const admin = await User.findOne({ email: 'admin@gmail.com' });
    if (!admin) {
      await User.create({
        name: 'EDITORIAL DIRECTOR (ADMIN)',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'Editorial Director',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
      console.log('✓ Admin user initialized (admin@gmail.com / admin123)');
    }

    const initialTechBlogs = [
      {
        title: "Artificial Intelligence 2.0: The Frontier of Neural Reasoning and Autonomy",
        slug: "artificial-intelligence-2-0-frontier-neural-reasoning",
        excerpt: "An in-depth analysis of next-generation transformer architectures, multi-modal reasoning engines, and autonomous AI agents reshaping digital infrastructure.",
        content: `<p class="text-xl font-serif leading-relaxed text-neutral-800 mb-6">Artificial Intelligence is undergoing a monumental paradigm shift. Modern neural architectures no longer rely solely on pattern recognition; instead, the frontier has decisively shifted toward multi-step reasoning, dynamic tool invocation, and autonomous problem solving.</p>
        <h2 class="text-2xl font-serif font-bold text-neutral-900 mt-8 mb-4">1. The Rise of Agentic Workflows</h2>
        <p class="mb-4">Autonomous AI agents are transforming enterprise operations by orchestrating multi-step workflows across distributed APIs, code execution environments, and real-time knowledge graphs. Rather than producing single isolated responses, agentic systems plan, verify, and execute complex goals independently.</p>
        <blockquote class="border-l-4 border-neutral-950 pl-6 py-2 my-6 font-serif italic text-lg text-neutral-800 bg-neutral-50 rounded-r-2xl">“The true breakthrough of AI 2.0 lies not just in generation, but in verifiable reasoning and autonomous execution.”</blockquote>
        <h2 class="text-2xl font-serif font-bold text-neutral-900 mt-8 mb-4">2. Multimodal Foundations</h2>
        <p class="mb-4">By unifying vision, audio, text, and sensor telemetry into a single latent representation space, next-generation AI models process complex real-world environments with spatial and temporal precision.</p>`,
        category: "Artificial Intelligence",
        tags: ["ARTIFICIAL INTELLIGENCE", "AI", "NEURAL NETWORKS"],
        mediaType: "Image",
        coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
        status: "Published",
        views: 2420,
        likes: 1840,
        isFeatured: true,
        comments: [
          { author: "Dr. Aris Thorne", text: "The breakdown of agentic reasoning pipelines is remarkably precise.", date: "Oct 4, 2026" },
          { author: "Elena Vance", text: "Multimodal latent spaces are enabling incredible robotics breakthroughs.", date: "Oct 5, 2026" }
        ],
      },
      {
        title: "Quantum Computing Mastery: Bridging Superconducting Qubits & Enterprise Systems",
        slug: "quantum-computing-mastery-superconducting-qubits",
        excerpt: "How fault-tolerant quantum hardware and error mitigation algorithms are unlocking unprecedented processing power for cryptography and molecular simulation.",
        content: `<p class="text-xl font-serif leading-relaxed text-neutral-800 mb-6">Quantum advantage is no longer a distant theoretical construct. Recent breakthroughs in cryogenic qubit stability and quantum error correction have accelerated commercial adoption across cryptography and materials discovery.</p>
        <h2 class="text-2xl font-serif font-bold text-neutral-900 mt-8 mb-4">Scalable Superconducting Processors</h2>
        <p class="mb-4">By scaling logical qubits beyond threshold noise limits, modern quantum processors simulate chemical bonds and optimize complex financial risk matrices in seconds—computations that would take classical supercomputers millennia.</p>`,
        category: "Quantum Computing",
        tags: ["QUANTUM COMPUTING", "HARDWARE", "CRYPTOGRAPHY"],
        mediaType: "Image",
        coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80",
        status: "Published",
        views: 1890,
        likes: 1450,
        comments: [
          { author: "Marcus Vance", text: "Quantum error correction is the true game changer.", date: "Oct 5, 2026" }
        ],
      },
      {
        title: "Zero-Trust Cybersecurity Architecture in the Era of Machine Intelligence",
        slug: "zero-trust-cybersecurity-architecture-machine-intelligence",
        excerpt: "Fortifying modern enterprise perimeters with AI-driven threat detection, immutable micro-segmentation, and post-quantum encryption standards.",
        content: `<p class="text-xl font-serif leading-relaxed text-neutral-800 mb-6">As distributed cloud workloads expand, traditional static security perimeters have become obsolete. Zero-Trust security enforces continuous identity verification and automated behavioral threat response.</p>
        <h2 class="text-2xl font-serif font-bold text-neutral-900 mt-8 mb-4">AI-Driven Anomaly Detection</h2>
        <p class="mb-4">Machine learning pipelines analyze network telemetry at terabit scale, discovering unauthorized access vectors and neutralizing zero-day exploits before lateral movement occurs.</p>`,
        category: "Cybersecurity",
        tags: ["CYBERSECURITY", "ZERO TRUST", "SECURITY"],
        mediaType: "Image",
        coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80",
        status: "Published",
        views: 2150,
        likes: 1720,
        comments: [
          { author: "Sarah Connor", text: "Zero-trust with automated mitigation is essential for modern infrastructure.", date: "Oct 5, 2026" }
        ],
      },
      {
        title: "The Evolution of Cloud Infrastructure: Serverless Edge & Distributed Computing",
        slug: "evolution-of-cloud-infrastructure-serverless-edge",
        excerpt: "Scaling global applications with sub-millisecond edge compute nodes, distributed databases, and automated multi-region failover pipelines.",
        content: `<p class="text-xl font-serif leading-relaxed text-neutral-800 mb-6">Modern cloud applications require ultra-low latency and seamless global availability. Serverless edge computing places compute logic directly at global network points of presence.</p>
        <h2 class="text-2xl font-serif font-bold text-neutral-900 mt-8 mb-4">Sub-Millisecond Global Routing</h2>
        <p class="mb-4">By executing serverless handlers on edge servers nearest to the end user, round-trip latency drops significantly while automatic scaling eliminates backend provisioning overhead.</p>`,
        category: "Cloud Architecture",
        tags: ["CLOUD ARCHITECTURE", "DEVOPS", "EDGE COMPUTE"],
        mediaType: "Image",
        coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
        status: "Published",
        views: 1650,
        likes: 1310,
        comments: [
          { author: "David K.", text: "Edge computing has completely reshaped our global database latency.", date: "Oct 5, 2026" }
        ],
      },
      {
        title: "Next-Gen Web Architecture: Micro-Frontends & High-Performance Frameworks",
        slug: "next-gen-web-architecture-micro-frontends",
        excerpt: "Building resilient, ultra-fast web applications using decoupled frontend architectures, WebAssembly modules, and modern rendering engines.",
        content: `<p class="text-xl font-serif leading-relaxed text-neutral-800 mb-6">Frontend engineering has evolved into a disciplined architectural domain. Micro-frontends allow autonomous engineering teams to build, test, and deploy modular frontend applications independently.</p>
        <h2 class="text-2xl font-serif font-bold text-neutral-900 mt-8 mb-4">WebAssembly & Near-Native Speed</h2>
        <p class="mb-4">By compiling C++, Rust, and Go binaries into WebAssembly, browser applications achieve high-performance compute speeds right in the user runtime environment.</p>`,
        category: "Web Development",
        tags: ["WEB DEVELOPMENT", "FRONTEND", "REACT"],
        mediaType: "Image",
        coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
        status: "Published",
        views: 1980,
        likes: 1620,
        comments: [
          { author: "Claire Bennet", text: "WebAssembly module integration has sped up our audio processing by 10x.", date: "Oct 5, 2026" }
        ],
      },
      {
        title: "Autonomous Systems & Robotics: Embodied AI in Real-World Operations",
        slug: "autonomous-systems-robotics-embodied-ai",
        excerpt: "How spatial intelligence, computer vision, and reinforcement learning are enabling humanoid robots and autonomous fleets to operate safely.",
        content: `<p class="text-xl font-serif leading-relaxed text-neutral-800 mb-6">Embodied AI brings artificial intelligence into physical space. From automated warehouse logistics to humanoid assistants, spatial awareness algorithms process real-world sensory feeds in real time.</p>
        <h2 class="text-2xl font-serif font-bold text-neutral-900 mt-8 mb-4">Spatial Intelligence & LiDAR Fusion</h2>
        <p class="mb-4">Fusing stereo camera vision with high-resolution LiDAR enables autonomous systems to construct dynamic 3D spatial representations of active environments.</p>`,
        category: "Robotics",
        tags: ["ROBOTICS", "EMBODIED AI", "AUTOMATION"],
        mediaType: "Image",
        coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80",
        status: "Published",
        views: 1740,
        likes: 1410,
        comments: [
          { author: "Antoine D.", text: "Sensory fusion algorithm improvements are remarkable.", date: "Oct 5, 2026" }
        ],
      },
    ];

    // Seed or update database with Tech & AI blogs
    for (const blogData of initialTechBlogs) {
      const exists = await Blog.findOne({ slug: blogData.slug });
      if (!exists) {
        await Blog.create(blogData);
      }
    }
    // Delete legacy fashion seed blogs if present
    await Blog.deleteMany({ category: { $in: ['Fall Collection', 'Casual Wear', 'Runway', 'Style', 'Sustainability'] } });
    console.log('✓ Tech & AI Editorial Blogs seeded to MongoDB Atlas');
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK', server: 'Wacaiki Node API' }));

// Serve compiled Frontend assets (Single-port fullstack deployment)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.join(__dirname, '../frontend/dist');

app.use(express.static(frontendDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Frontend dist/index.html not found. Please run npm run build');
    }
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  seedDatabase();
  app.listen(PORT, () => console.log(`✓ Server running at http://localhost:${PORT}`));
});
