export interface ToolPlan {
  label: string
  pricePerSeat: number
}

export interface AITool {
  id: string
  name: string
  category: 'ide' | 'chat' | 'api'
  plans: ToolPlan[]
}

export const AI_TOOLS: AITool[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'ide',
    plans: [
      { label: 'Hobby (Free)', pricePerSeat: 0 },
      { label: 'Pro', pricePerSeat: 20 },
      { label: 'Business', pricePerSeat: 40 },
    ],
  },
  {
    id: 'claude',
    name: 'Claude',
    category: 'chat',
    plans: [
      { label: 'Free', pricePerSeat: 0 },
      { label: 'Pro', pricePerSeat: 20 },
      { label: 'Team', pricePerSeat: 25 },
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'chat',
    plans: [
      { label: 'Free', pricePerSeat: 0 },
      { label: 'Plus', pricePerSeat: 20 },
      { label: 'Team', pricePerSeat: 25 },
      { label: 'Enterprise', pricePerSeat: 60 },
    ],
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    category: 'ide',
    plans: [
      { label: 'Individual', pricePerSeat: 10 },
      { label: 'Business', pricePerSeat: 19 },
      { label: 'Enterprise', pricePerSeat: 39 },
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    category: 'chat',
    plans: [
      { label: 'Free', pricePerSeat: 0 },
      { label: 'Advanced', pricePerSeat: 20 },
      { label: 'Business', pricePerSeat: 24 },
    ],
  },
  {
    id: 'openai-api',
    name: 'OpenAI API',
    category: 'api',
    plans: [
      { label: 'Pay-as-you-go', pricePerSeat: 0 },
      { label: 'Prepaid Credits', pricePerSeat: 0 },
    ],
  },
  {
    id: 'anthropic-api',
    name: 'Anthropic API',
    category: 'api',
    plans: [
      { label: 'Pay-as-you-go', pricePerSeat: 0 },
      { label: 'Prepaid Credits', pricePerSeat: 0 },
    ],
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    category: 'ide',
    plans: [
      { label: 'Free', pricePerSeat: 0 },
      { label: 'Pro', pricePerSeat: 15 },
      { label: 'Team', pricePerSeat: 35 },
    ],
  },
]

export const USE_CASES = [
  { value: 'coding', label: 'Coding & Development' },
  { value: 'writing', label: 'Writing & Content' },
  { value: 'research', label: 'Research & Analysis' },
  { value: 'customer_support', label: 'Customer Support' },
  { value: 'data_analysis', label: 'Data Analysis' },
  { value: 'general', label: 'General Use' },
]