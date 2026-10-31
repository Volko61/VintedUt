import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { Dropzone, IMAGE_MIME_TYPE, type FileRejection } from "@mantine/dropzone";
import {
  ActionIcon,
  Group,
  Image,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const MAX_SIZE = 5 * 1024 ** 2;

type UploadedImage = {
  imageId: Id<"_storage">;
  previewUrl: string;
};

type DropzoneImageProps = {
  /** Called with the full, ordered list of uploaded image ids on every change. */
  onChange?: (imageIds: Id<"_storage">[]) => void;
  maxFiles?: number;
  error?: React.ReactNode;
};

export default function DropzoneImage({ onChange, maxFiles, error }: DropzoneImageProps) {
  const { t } = useTranslation();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const imagesRef = useRef(images);
  imagesRef.current = images;

  // Release object URLs on unmount.
  useEffect(
    () => () => imagesRef.current.forEach((i) => URL.revokeObjectURL(i.previewUrl)),
    [],
  );

  const update = (next: UploadedImage[]) => {
    setImages(next);
    onChange?.(next.map((i) => i.imageId));
  };

  const uploadFile = async (file: File): Promise<UploadedImage> => {
    const url = await generateUploadUrl();
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!res.ok) throw new Error(`Upload failed (${res.status})`);
    const { storageId } = (await res.json()) as { storageId: Id<"_storage"> };
    return { imageId: storageId, previewUrl: URL.createObjectURL(file) };
  };

  const handleDrop = async (files: File[]) => {
    const remaining = maxFiles ? maxFiles - images.length : files.length;
    const toUpload = files.slice(0, Math.max(remaining, 0));
    if (toUpload.length === 0) return;

    setUploading(true);
    const results = await Promise.allSettled(toUpload.map(uploadFile));
    setUploading(false);

    const uploaded = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
    if (uploaded.length < results.length) {
      notifications.show({
        color: "red",
        message: t("dropzone.uploadFailed"),
      });
    }
    if (uploaded.length > 0) update([...imagesRef.current, ...uploaded]);
  };

  const handleReject = (rejections: FileRejection[]) => {
    notifications.show({
      color: "red",
      message: t("dropzone.rejected", { count: rejections.length }),
    });
  };

  const handleRemove = (imageId: Id<"_storage">) => {
    const removed = images.find((i) => i.imageId === imageId);
    if (removed) URL.revokeObjectURL(removed.previewUrl);
    update(images.filter((i) => i.imageId !== imageId));
  };

  return (
    <>
      <Dropzone
        onDrop={handleDrop}
        onReject={handleReject}
        maxSize={MAX_SIZE}
        accept={IMAGE_MIME_TYPE}
        disabled={uploading || (maxFiles !== undefined && images.length >= maxFiles)}
        loading={uploading}
      >
        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
          <Dropzone.Accept>
            <IconUpload size={52} color="var(--mantine-color-blue-6)" />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={52} color="var(--mantine-color-red-6)" />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size={52} color="var(--mantine-color-dimmed)" />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              {t("dropzone.title")}
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              {t("dropzone.hint")}
            </Text>
          </div>
        </Group>
      </Dropzone>

      {error && (
        <Text c="red" size="sm" mt="xs">
          {error}
        </Text>
      )}

      {images.length > 0 && (
        <SimpleGrid cols={{ base: 2, sm: 4 }} mt="md">
          {images.map(({ imageId, previewUrl }) => (
            <div key={imageId} style={{ position: "relative" }}>
              <Image src={previewUrl} radius="md" h={140} fit="cover" />
              <ActionIcon
                variant="filled"
                color="red"
                size="sm"
                radius="xl"
                pos="absolute"
                top={6}
                right={6}
                aria-label={t("dropzone.remove")}
                onClick={() => handleRemove(imageId)}
              >
                <IconX size={14} />
              </ActionIcon>
            </div>
          ))}
        </SimpleGrid>
      )}
    </>
  );
}
