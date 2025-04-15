import * as Dialog from "@radix-ui/react-dialog";

interface Props {
  triggerText: string;
  title: string;
  children: React.ReactNode;
}

export function Modal({ triggerText, title, children }: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="bg-transparent text-white border border-zinc-600 px-4 py-2 rounded hover:bg-zinc-900 cursor-pointer transition-colors">
          {triggerText}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-800 text-white rounded-lg p-6 w-[90vw] max-w-md z-50 shadow-xl">
          <Dialog.Title className="text-xl font-bold  mb-4">
            {title}
          </Dialog.Title>
          {children}
          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-400 cursor-pointer transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
