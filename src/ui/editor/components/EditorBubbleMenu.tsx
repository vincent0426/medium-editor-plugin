import { BubbleMenu, BubbleMenuProps } from '@tiptap/react';
import classNames from 'classnames';
import {
  BsCheck
} from 'react-icons/bs';
import { GrBold, GrItalic } from 'react-icons/gr';
import { BiLink, BiText } from 'react-icons/bi';
import { ReactNode, useCallback, useState } from 'react';
import * as React from 'react';
import { useOutsideClick } from '../../../lib/hooks/use-outside-click';

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: ReactNode;
}

type EditorBubbleMenuProps = Omit<BubbleMenuProps, 'children'> & {
  showBubbleMenu: boolean;
};

export const EditorBubbleMenu = ({ editor, showBubbleMenu }: EditorBubbleMenuProps) => {
  const setLink = useCallback(() => {    
    // If there's an active link, get its URL
    const previousUrl = editor?.getAttributes('link').href;

    setShowLinkInput(true);
    // wait for the input to be rendered
    setTimeout(() => {
      linkInputRef.current.focus();
    }, 0);
    if(previousUrl) {
      setLinkInputValue(previousUrl);
    }
  }, [editor]);
  const items: BubbleMenuItem[] = [
    {
      name: 'bold',
      icon: <GrBold className='w-6 h-6' />,
      command: () => editor?.chain().focus().toggleBold().run(),
      isActive: () => editor?.isActive('bold')
    },
    {
      name: 'italic',
      icon: <GrItalic className='w-6 h-6' />,
      command: () => editor?.chain().focus().toggleItalic().run(),
      isActive: () => editor?.isActive('italic')
    },
    {
      name: 'link',
      icon: <BiLink className='w-6 h-6' />,
      command: setLink,
      isActive: () => editor?.isActive('link')
    },
    {
      name: 'heading2',
      icon: <BiText className='w-6 h-6' />,
      command: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor?.isActive('heading', { level: 2 })
    },
    {
      name: 'heading3',
      icon: <BiText className='w-4 h-4' />,
      command: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor?.isActive('heading', { level: 3 })
    }
  ];
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkInputValue, setLinkInputValue] = useState('');
  const handleLinkInputClickOutside = () => {
    const selection = window.getSelection();
    const linkInput = linkInputRef.current;
  
    // Check if the click target is inside the link input
    if (linkInput && selection && selection.containsNode(linkInput, true)) {
      return;
    }
  
    setShowLinkInput(false);
  };
  const linkInputRef = useOutsideClick(handleLinkInputClickOutside);
  
  const confirmLink = () => {
    if (linkInputValue) {
      // Update link
      editor?.chain().focus().extendMarkRange('link').setLink({
        href: linkInputValue,
        target: '_blank'
      }).run();
    } else {
      // Unset link
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    
    setShowLinkInput(false);
    setLinkInputValue('');
  };
  
  return (
    <BubbleMenu
      className={classNames(
        showBubbleMenu ? 'flex' : 'hidden',
        // border radius 5px
        'border w-fit px-2 justify-center bg-[#262625] rounded-[5px] cursor-default'
      )}
      editor={editor}
      tippyOptions={{
        duration: 100
      }}
    >
      {showLinkInput ? (
        <>
          <input
            ref={linkInputRef}
            type="url"
            value={linkInputValue}
            onChange={(e) => setLinkInputValue(e.target.value)}
            placeholder="Enter URL..."
            className="w-32 bg-gray-600 text-white px-2 py-1 rounded-lg outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                confirmLink();
              }
            }}
          />
          <button
            onClick={confirmLink}
          >
            <BsCheck className="h-6 w-6 text-white" />
          </button>
        </>
      ) : (
        <div className='space-x-2 flex items-center'>
          {items.map((item) => (
            <button
              key={item.name}
              onClick={item.command}
              className={classNames(
                item.isActive() ? 'text-[#b5e5a4]' : 'bg-transparent text-white',
                'rounded-lg px-1 py-1'
              )}
            >
              {item.icon}
            </button>
          ))}
        </div>
      )}
    </BubbleMenu>
  );
};