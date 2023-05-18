"use client";

import React, { FC, PropsWithChildren, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { File } from "../lib/files";

const Img: React.FC<File & { index: number; reorderImage: ImagesProps["reorderImage"] }> = ({
  file,
  fileName,
  index,
  reorderImage,
}) => {
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
          reorderImage(target.index, index);
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

interface ImagesProps {
  images: File[];
  reorderImage: (to: number, from: number) => void;
}

export const Images: FC<ImagesProps> = ({ images, reorderImage }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <ul className="images">
        {images.map(({ fileName: imageName, file: image }, i) => (
          <ImgDropper key={imageName + i} index={i}>
            <Img fileName={imageName} file={image} index={i} reorderImage={reorderImage} />
          </ImgDropper>
        ))}
      </ul>
    </DndProvider>
  );
};
