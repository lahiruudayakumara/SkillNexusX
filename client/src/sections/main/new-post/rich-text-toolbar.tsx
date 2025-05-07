interface Props {
  execCommand: (command: string, value?: string) => void;
}

const RichTextToolbar: React.FC<Props> = ({ execCommand }) => (
  <div className="flex gap-2 text-sm mb-2">
    <button className="p-1 shadow bg-slate-100 cursor-pointer hover:bg-slate-200 min-w-8"  type="button" onClick={() => execCommand("bold")}>
      <b>B</b>
    </button>
    <button className="p-1 shadow bg-slate-100 cursor-pointer hover:bg-slate-200 min-w-8"  type="button" onClick={() => execCommand("underline")}>
      <u>U</u>
    </button>
    <button className="p-1 shadow bg-slate-100 cursor-pointer hover:bg-slate-200 min-w-8"  type="button" onClick={() => execCommand("insertUnorderedList")}>
      • List
    </button>
    <button className="p-1 shadow bg-slate-100 cursor-pointer hover:bg-slate-200 min-w-8" type="button" onClick={() => execCommand("fontSize", "4")}>
      A+
    </button>
    <button className="p-1 shadow bg-slate-100 cursor-pointer hover:bg-slate-200 min-w-8"  type="button" onClick={() => execCommand("fontSize", "2")}>
      A-
    </button>
    <button
      type="button"
      className="p-1 shadow bg-slate-100 cursor-pointer hover:bg-slate-200" 
      onClick={() => execCommand("formatBlock", "<blockquote>")}
    >
      “ Quote ”
    </button>
  </div>
);

export default RichTextToolbar;
