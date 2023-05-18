"use client";

import React, { PropsWithChildren, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useFilesContext } from "../contexts/FilesContext";
import { File } from "../utility/files";

import styles from "./Images.module.scss";

const Img: React.FC<File & { index: number }> = ({ file, fileName, index }) => {
  const { moveFile } = useFilesContext();
  const image = useMemo(
    () => (
      <li className="flex flex-col items-center">
        <label>{fileName}</label>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={file} alt={fileName} className="border border-indigo-600 border-3 cursor-pointer" />
      </li>
    ),
    [file, fileName]
  );

  const [_, dragRef] = useDrag(
    () => ({
      type: "image",
      item: { text: image },
      end: (_, monitor) => {
        const target = monitor.getDropResult<{ index: number }>();
        if (target?.index != null) {
          moveFile(target.index, index);
        }
      },
    }),
    [index]
  );

  return <div ref={dragRef}>{image}</div>;
};

const ImgDropper = ({ index, children }: PropsWithChildren<{ index: number }>) => {
  const [_, drop] = useDrop(
    () => ({
      accept: "image",
      drop: () => ({
        index,
      }),
    }),
    [index]
  );

  return <div ref={drop}>{children}</div>;
};

export const Images = () => {
  const { files } = useFilesContext();

  return (
    <DndProvider backend={HTML5Backend}>
      <ul className={styles.images}>
        {files.map(({ fileName, file }, i) => (
          <ImgDropper key={fileName + i} index={i}>
            <Img fileName={fileName} file={file} index={i} />
          </ImgDropper>
        ))}
      </ul>
    </DndProvider>
  );
};
