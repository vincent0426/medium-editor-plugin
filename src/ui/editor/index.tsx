import '../../styles/editor.css';
import React from 'react';
import { EditorContent, FloatingMenu, JSONContent, useEditor
} from '@tiptap/react';
import classNames from 'classnames';
import { useEffect, useRef, useState
} from 'react';
import {
  BsImage, BsListOl,
  BsListUl, BsPlus
} from 'react-icons/bs';
import { PiBracketsCurly } from 'react-icons/pi';
import { MdOutlineHorizontalRule } from 'react-icons/md';

import { ConvertBase64 } from '../../utils/convert-base64';
import { useOutsideClick } from '../../lib/hooks/use-outside-click';

import Button from './components/Button';
import ImageResize from './extensions/image-resizer';
import InlineSelector from './extensions/inline-selector';
import { Extensions } from './extensions';
import { EditorBubbleMenu } from './components/EditorBubbleMenu';
function Editor() {
  const [content, setContent] = useState<JSONContent>([]);
  console.log('content', content)
  const [plainContent, setPlainContent] = useState('');
  console.log('plainContent', plainContent)
  const [showBubbleMenu, setShowBubbleMenu] = useState(false);
  const [showFloatMenu, setShowFloatMenu] = useState(false);
  const [showPlusButton, setShowPlusButton] = useState(true);

  const hiddenFileInput = useRef() as React.MutableRefObject<HTMLInputElement>;

  // const debouncedContentJSON = useDebouncedCallback((_content) => {
  //   setContent(_content);
  // }, 300);

  const shouldFloatingMenuShow = (editor: any) => {
    console.log('shouldFloatingMenuShow', editor);
    console.log('editor.state', editor.state);
    const { selection } = editor.state;
    
    // if current pointer is inside the code block, do not show the floating menu.
    if (selection.$head.parent.type.name === 'codeBlock') {
      return false;
    }
    // If the selection is not empty, do not show the floating menu.
    // If depth is 1, it means the selection is in the top level of the document.
    // ol, ul depth will not be 1, so we need to check if the selection is in the top level.
    if (!selection.empty || selection.$head.parent.content.size > 0 || selection.$head.depth !== 1) {
      return false;
    }

    return true;
  };

  const alertUser = (e: any) => {
    e.preventDefault();
    e.returnValue = '';
  };

  useEffect(() => {
    window.addEventListener('beforeunload', alertUser);

    return () => {
      window.removeEventListener('beforeunload', alertUser);
    };
  }, []);
  
  const editor = useEditor({
    onUpdate({ editor }) {
      setPlainContent(editor.getText());
      setContent(editor.getJSON());
    // debouncedContentJSON(editor.getJSON());
    },
    onFocus() {
      setShowFloatMenu(false);
    },
    onBlur() {
      setShowFloatMenu(false);
    },
    onSelectionUpdate({ editor }) {
      setShowBubbleMenu(true);
      setShowPlusButton(true);

      if (editor.isActive('image') || editor.isActive('horizontalRule')) {
        setShowBubbleMenu(false);
        setShowPlusButton(false);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose-lg prose-prime prose-headings:font-display font-default focus:outline-none max-w-full'
      }
    },
    // only bullet list and ordered list
    enableInputRules: [
      'bulletList',
      'orderedList',
      'blockquote',
      'heading',
      'horizontalRule'
    ],
    enablePasteRules: false,
    extensions: Extensions
  });

  const handlePlusButtonClickOutside = () => {
    setShowFloatMenu(false);
  };

  const plusButtonRef = useOutsideClick(handlePlusButtonClickOutside);

  const handleClick = () => {
    hiddenFileInput?.current.click();
  };

  const addImage = async (e: any) => {
    const file = e.target.files[0];
    // const url = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/440px-Image_created_with_a_mobile_phone.png";
    const base64 = await ConvertBase64(file);

    if (base64) {
      editor?.chain().focus().setImage({
        src: base64
      }).run();
    }

    // console.log(editor.getHTML());
    // const { value: file } = await Swal.fire({
    //     title: "Select image",
    //     input: "file",
    //     inputAttributes: {
    //         accept: "image/*",
    //         "aria-label": "Upload your profile picture",
    //     },
    // });

    // if (file) {
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //         editor.chain().focus().setImage({ src: e.target.result }).run();
    //     };
    //     reader.readAsDataURL(file);
    // }
  };

  if (editor == null) return null;

  return (
    <div className='relative min-h-[500px] mx-auto w-full max-w-screen-lg border-stone-200 bg-white p-12 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg'>
      <EditorBubbleMenu editor={editor} showBubbleMenu={showBubbleMenu} />
      <FloatingMenu
        className={classNames(showPlusButton ? 'flex' : 'hidden', 'relative')}
        editor={editor}
        // don't show if current node is h1 or if current node is not empty
        shouldShow={() => shouldFloatingMenuShow(editor)}
        tippyOptions={{
          duration: 100
        }}
      >
        <button
          ref={plusButtonRef}
          className={classNames(
            'absolute right-5 top-[-14px] rounded-full border border-[#a8a29e] p-1 text-[#a8a29e] transition-transform duration-300',
            { 'rotate-45': showFloatMenu }
          )}
          onClick={() => { 
            setShowFloatMenu(!showFloatMenu); 
          }}
        >
          <BsPlus className="text-[#a8a29e]" size={20} />
        </button>

        {showFloatMenu && (
          <div className='absolute -left-3 -top-5 flex h-10 w-48 items-center space-x-3 bg-white'>
            <Button
              onClick={handleClick}
            >
              <BsImage className="text-[#a8a29e]" size={20} />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={editor.isActive('codeBlock') ? 'is-active' : ''}
            >
              <PiBracketsCurly className="text-[#a8a29e]" size={20} />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <BsListUl className="text-[#a8a29e]" size={20} />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <BsListOl className=" text-[#a8a29e]" size={20} />
            </Button>
            <Button
              onClick={() => {
                editor.chain().focus().setHorizontalRule().run();
              }}
            >
              <MdOutlineHorizontalRule className="text-[#a8a29e]" size={20} />
            </Button>
          </div>
        )}
      </FloatingMenu>
      <input
        ref={hiddenFileInput}
        hidden
        accept="image/*"
        type="file"
        onInput={(e) => {
          addImage(e);
        }}
      />
      <InlineSelector editor={editor} />
      {editor?.isActive('image') && <ImageResize editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}

export default Editor;

