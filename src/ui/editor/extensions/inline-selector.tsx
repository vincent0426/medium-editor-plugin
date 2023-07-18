import { BubbleMenu } from '@tiptap/react';
import * as React from 'react';
import {  AlignCenterIcon,AlignLeftIcon, AlignRightIcon  } from '../../../ui/icons/align';

type InlineSelectorProps = {
  editor: any;
};

const InlineSelector = ({ editor }: InlineSelectorProps) => {

  // checking whether the format is active ot not
  const isActive = (name: string | { textAlign: string }) => editor?.isActive(name) ? '' : 'text-stone-300';
  const toggleSelector = () => editor.chain().focus();

  return (
    <>
      {editor && (
        <BubbleMenu
          editor={editor}
          pluginKey="bubbleMenuForText"
          shouldShow={({ editor }) => {
            return editor.isActive('image');
          }}
          tippyOptions={{ duration: 100 }}
        >
          <section
            className="inlineSelector flex items-center justify-between space-x-2 py-1 px-2 bg-dark border border-glass rounded-lg"
          >
            {!editor.isActive('table') && (
              <>
                <button
                  className={`${isActive({ textAlign: 'left' })}`}
                  onClick={() => toggleSelector().setTextAlign('left').run()}
                >
                  <AlignLeftIcon />
                </button>
                <button
                  className={`${isActive({ textAlign: 'center' })}`}
                  onClick={() => {
                    console.log('center');
                    editor.chain().focus().setTextAlign('center').run();
                  }}
                >
                  <AlignCenterIcon />
                </button>
                <button
                  className={`${isActive({ textAlign: 'right' })}`}
                  onClick={() => toggleSelector().setTextAlign('right').run()}
                >
                  <AlignRightIcon />
                </button>
                <div className=" w-[1px] h-5 bg-glass"></div>
              </>
            )}
          </section>
        </BubbleMenu>
      )}
    </>
  );
};

export default InlineSelector;
