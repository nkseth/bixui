import React, { useRef, useState } from "react";

import styles from "../styles/components/FileDropArea.module.scss";

type FileDropAreaPorps = {
   onUpload: (files: FileList) => void;
   allowed: string[];
   multiple?: boolean;
} & Pick<React.HTMLAttributes<HTMLDivElement>, "className" | "style">;

const FileDropArea: React.FC<FileDropAreaPorps> = ({
   onUpload,
   children,
   allowed,
   multiple,
   ...props
}) => {
   const [isDragging, setIsDragging] = useState(false);
   const fileInputRef = useRef<HTMLInputElement | null>(null);

   const preventDefaults = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
   };

   const handleFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      preventDefaults(e);
      e.target.files && onUpload(e.target.files);
   };

   const handleFileDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
      preventDefaults(e);
      setIsDragging(false);

      const files = e.dataTransfer.files;

      onUpload(files);
   };
   
   return (
      <>
         <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileInputChange}
            accept={allowed.join(",")}
            multiple={multiple}
         />
         <div
            className={styles.container}
            {...props}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDragOver={preventDefaults}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
         >
            {isDragging ? (
               <i className="fas fa-file-upload" />
            ) : (
               <i className="far fa-plus" />
            )}
         </div>
      </>
   );
};

export default FileDropArea;
