export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Remote" | "Contract";
  salary: string;
  posted: string;
  deadline?: string;
  description: string;
  tags: string[];
  qualifications?: string[];
  responsibilities?: string[];
}

export const mockJobs: Job[] = [
  { id: "1", title: "Senior Frontend Engineer", company: "TechNova", location: "Bengaluru, KA", type: "Remote", salary: "₹12L – ₹18L", posted: "2 hours ago", description: "Build next-gen React interfaces for our AI platform.", tags: ["React", "TypeScript", "Tailwind"], qualifications: ["B.Tech/B.E. in Computer Science or related field", "3+ years of experience with React & TypeScript", "Strong understanding of responsive design and CSS frameworks", "Familiarity with RESTful APIs and state management"], responsibilities: ["Develop and maintain high-performance React applications", "Collaborate with designers and backend engineers", "Write clean, testable, and well-documented code", "Participate in code reviews and technical discussions"] },
  { id: "2", title: "Backend Developer", company: "DataStream", location: "Hyderabad, TS", type: "Full-time", salary: "₹10L – ₹15L", posted: "5 hours ago", description: "Design scalable Spring Boot microservices.", tags: ["Java", "Spring Boot", "MySQL"], qualifications: ["B.Tech/M.Tech in CS/IT or equivalent", "2+ years with Java and Spring Boot", "Experience with relational databases", "Knowledge of REST APIs and microservices architecture"], responsibilities: ["Design and implement scalable backend services", "Optimize database queries and application performance", "Integrate third-party APIs and services", "Ensure application security and data protection"] },
  { id: "3", title: "Product Designer", company: "PixelCraft", location: "Pune, MH", type: "Full-time", salary: "₹8L – ₹12L", posted: "1 day ago", description: "Shape the UX of enterprise SaaS products.", tags: ["Figma", "UX", "Design Systems"], qualifications: ["Bachelor's degree in Design, HCI, or related field", "2+ years of product design experience", "Proficiency in Figma and prototyping tools", "Strong portfolio showcasing UX/UI projects"], responsibilities: ["Conduct user research and usability testing", "Create wireframes, prototypes, and high-fidelity designs", "Maintain and evolve the design system", "Collaborate closely with engineering and product teams"] },
  { id: "4", title: "ML Engineer", company: "DeepHire AI", location: "Remote", type: "Remote", salary: "₹15L – ₹25L", posted: "3 hours ago", description: "Build AI matching algorithms for talent discovery.", tags: ["Python", "TensorFlow", "NLP"], qualifications: ["M.Tech/PhD in ML, AI, or related field", "Strong proficiency in Python and ML frameworks", "Experience with NLP and deep learning models", "Published research is a plus"], responsibilities: ["Develop and train ML models for candidate matching", "Build data pipelines for model training and inference", "Evaluate and improve model accuracy and performance", "Stay updated with latest ML/AI research and trends"] },
  { id: "5", title: "DevOps Engineer", company: "CloudScale", location: "Chennai, TN", type: "Contract", salary: "₹10L – ₹14L", posted: "1 day ago", description: "Automate CI/CD pipelines and cloud infrastructure.", tags: ["AWS", "Docker", "Kubernetes"], qualifications: ["B.Tech in CS/IT or equivalent experience", "2+ years in DevOps or SRE roles", "Hands-on experience with AWS, Docker, Kubernetes", "Knowledge of CI/CD tools like Jenkins or GitHub Actions"], responsibilities: ["Set up and manage CI/CD pipelines", "Monitor and maintain cloud infrastructure", "Automate deployment and scaling processes", "Implement infrastructure as code using Terraform"] },
  { id: "6", title: "Full Stack Developer", company: "AppForge", location: "Mumbai, MH", type: "Full-time", salary: "₹11L – ₹16L", posted: "6 hours ago", description: "End-to-end feature development for our hiring platform.", tags: ["React", "Node.js", "PostgreSQL"], qualifications: ["B.Tech/B.E. in Computer Science or equivalent", "2+ years full-stack development experience", "Proficiency in React, Node.js, and SQL databases", "Experience with Git and agile methodologies"], responsibilities: ["Build full-stack features from design to deployment", "Write and maintain APIs using Node.js/Express", "Develop responsive front-end interfaces with React", "Collaborate with cross-functional teams on product features"] },
];
