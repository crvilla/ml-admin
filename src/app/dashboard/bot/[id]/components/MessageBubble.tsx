// components/MessageBubble.tsx
interface Props {
  text: string
  sender: 'user' | 'bot'
}

export function MessageBubble({ text, sender }: Props) {
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${
          sender === 'user' ? 'bg-orange-500 text-white' : 'bg-white text-gray-800 border'
        }`}
      >
        <div dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br />') }} />
      </div>
    </div>
  )
}
