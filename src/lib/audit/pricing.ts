export interface Plan {
  id: string
  label: string
  pricePerSeat: number
  maxSeats?: number
  minSeats?: number
  features: string[]
}

export interface ToolPricing {
  id: string
  name: string
  category: 'ide' | 'chat' | 'api'
  plans: Plan[]
  alternatives?: string[] // tool ids
}

export const PRICING: Record<string, ToolPricing> = {
  cursor: {
    id: 'cursor',
    name: 'Cursor',
    category: 'ide',
    alternatives: ['windsurf', 'github-copilot'],
    plans: [
      {
        id: 'hobby',
        label: 'Hobby (Free)',
        pricePerSeat: 0,
        maxSeats: 1,
        features: ['2000 completions/month', 'Limited chat'],
      },
      {
        id: 'pro',
        label: 'Pro',
        pricePerSeat: 20,
        features: ['Unlimited completions', 'Claude & GPT-4', 'Priority support'],
      },
      {
        id: 'business',
        label: 'Business',
        pricePerSeat: 40,
        minSeats: 20,
        features: ['Everything in Pro', 'Admin dashboard', 'SSO'],
      },
    ],
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    category: 'chat',
    alternatives: ['chatgpt', 'gemini'],
    plans: [
      {
        id: 'free',
        label: 'Free',
        pricePerSeat: 0,
        features: ['Limited messages', 'Claude 3 Haiku'],
      },
      {
        id: 'pro',
        label: 'Pro',
        pricePerSeat: 20,
        features: ['Unlimited messages', 'Claude 3.5 Sonnet', 'Priority access'],
      },
      {
        id: 'team',
        label: 'Team',
        pricePerSeat: 25,
        minSeats: 5,
        features: ['Everything in Pro', 'Admin console', 'Shared billing'],
      },
    ],
  },
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'chat',
    alternatives: ['claude', 'gemini'],
    plans: [
      {
        id: 'free',
        label: 'Free',
        pricePerSeat: 0,
        features: ['GPT-3.5', 'Limited GPT-4'],
      },
      {
        id: 'plus',
        label: 'Plus',
        pricePerSeat: 20,
        features: ['GPT-4o', 'DALL-E', 'Advanced data analysis'],
      },
      {
        id: 'team',
        label: 'Team',
        pricePerSeat: 25,
        minSeats: 2,
        features: ['Everything in Plus', 'Admin console', 'Higher limits'],
      },
      {
        id: 'enterprise',
        label: 'Enterprise',
        pricePerSeat: 60,
        minSeats: 150,
        features: ['Unlimited GPT-4', 'SSO', 'Custom data retention'],
      },
    ],
  },
  'github-copilot': {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    category: 'ide',
    alternatives: ['cursor', 'windsurf'],
    plans: [
      {
        id: 'individual',
        label: 'Individual',
        pricePerSeat: 10,
        maxSeats: 1,
        features: ['Code completions', 'Chat in IDE'],
      },
      {
        id: 'business',
        label: 'Business',
        pricePerSeat: 19,
        features: ['Everything in Individual', 'Policy management', 'Audit logs'],
      },
      {
        id: 'enterprise',
        label: 'Enterprise',
        pricePerSeat: 39,
        features: ['Everything in Business', 'Fine-tuned models', 'PR summaries'],
      },
    ],
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    category: 'chat',
    alternatives: ['claude', 'chatgpt'],
    plans: [
      {
        id: 'free',
        label: 'Free',
        pricePerSeat: 0,
        features: ['Gemini 1.5 Flash', 'Limited usage'],
      },
      {
        id: 'advanced',
        label: 'Advanced',
        pricePerSeat: 20,
        features: ['Gemini 1.5 Pro', 'Google One 2TB', 'Priority access'],
      },
      {
        id: 'business',
        label: 'Business',
        pricePerSeat: 24,
        minSeats: 1,
        features: ['Everything in Advanced', 'Admin controls', 'Audit logs'],
      },
    ],
  },
  'openai-api': {
    id: 'openai-api',
    name: 'OpenAI API',
    category: 'api',
    alternatives: ['anthropic-api'],
    plans: [
      {
        id: 'payg',
        label: 'Pay-as-you-go',
        pricePerSeat: 0,
        features: ['GPT-4o', 'GPT-3.5', 'Per-token billing'],
      },
      {
        id: 'prepaid',
        label: 'Prepaid Credits',
        pricePerSeat: 0,
        features: ['Discounted rates', 'All models'],
      },
    ],
  },
  'anthropic-api': {
    id: 'anthropic-api',
    name: 'Anthropic API',
    category: 'api',
    alternatives: ['openai-api'],
    plans: [
      {
        id: 'payg',
        label: 'Pay-as-you-go',
        pricePerSeat: 0,
        features: ['Claude 3.5 Sonnet', 'Claude 3 Haiku', 'Per-token billing'],
      },
      {
        id: 'prepaid',
        label: 'Prepaid Credits',
        pricePerSeat: 0,
        features: ['Discounted rates', 'All models'],
      },
    ],
  },
  windsurf: {
    id: 'windsurf',
    name: 'Windsurf',
    category: 'ide',
    alternatives: ['cursor', 'github-copilot'],
    plans: [
      {
        id: 'free',
        label: 'Free',
        pricePerSeat: 0,
        features: ['Limited completions', 'Basic chat'],
      },
      {
        id: 'pro',
        label: 'Pro',
        pricePerSeat: 15,
        features: ['Unlimited completions', 'All models', 'Priority support'],
      },
      {
        id: 'team',
        label: 'Team',
        pricePerSeat: 35,
        minSeats: 5,
        features: ['Everything in Pro', 'Admin dashboard', 'SSO'],
      },
    ],
  },
}