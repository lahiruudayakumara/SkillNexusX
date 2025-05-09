import { Facebook, Twitter, Linkedin, X, MessageCircle } from "lucide-react";

interface SharePopupBoxProps {
    postUrl: string;
    postTitle?: string;
    open: boolean;
    setOpen: () => void;
}

const SharePopupBox = ({ postUrl, open, setOpen, postTitle = "Check this out!" }: SharePopupBoxProps) => {
    const encodedUrl = encodeURIComponent(postUrl);
    const encodedTitle = encodeURIComponent(postTitle);

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
        whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    };

    return (
        <div className="relative inline-block">
            {open && (
                <div className="absolute z-50 mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-60 space-y-3">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-semibold">Share this post</h4>
                        <button onClick={setOpen} className="text-gray-400 cursor-pointer hover:text-gray-600">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <a
                            href={shareLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                        >
                            <Facebook size={18} /> Facebook
                        </a>
                        <a
                            href={shareLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-sky-500 hover:underline"
                        >
                            <Twitter size={18} /> Twitter
                        </a>
                        <a
                            href={shareLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-800 hover:underline"
                        >
                            <Linkedin size={18} /> LinkedIn
                        </a>
                        <a
                            href={shareLinks.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-green-600 hover:underline"
                        >
                            <MessageCircle size={18} /> WhatsApp
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SharePopupBox;