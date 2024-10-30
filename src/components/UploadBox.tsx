'use client';
import { FaTrashCan } from 'react-icons/fa6';
import { Button } from '~/components/ui/button';
import { FileUpload } from '~/components/ui/file-upload';
import { IconButton } from '~/components/ui/icon-button';

export function UploadBox(props: FileUpload.RootProps & { file?: File }) {
  const { file, ...rest } = props;
  return (
    <FileUpload.Root {...rest}>
      {!file && (
        <FileUpload.Dropzone>
          <FileUpload.Label>Drop your files here</FileUpload.Label>
          <FileUpload.Trigger asChild>
            <Button size="sm">Open Dialog</Button>
          </FileUpload.Trigger>
        </FileUpload.Dropzone>
      )}
      <FileUpload.ItemGroup>
        <FileUpload.Context>
          {({ acceptedFiles }) =>
            acceptedFiles.map((file, id) => (
              <FileUpload.Item key={id} file={file}>
                <FileUpload.ItemPreview type="image/*">
                  <FileUpload.ItemPreviewImage />
                </FileUpload.ItemPreview>
                <FileUpload.ItemName />
                <FileUpload.ItemSizeText />
                <FileUpload.ItemDeleteTrigger asChild>
                  <IconButton variant="link" size="sm">
                    <FaTrashCan />
                  </IconButton>
                </FileUpload.ItemDeleteTrigger>
              </FileUpload.Item>
            ))
          }
        </FileUpload.Context>
      </FileUpload.ItemGroup>
      <FileUpload.HiddenInput />
    </FileUpload.Root>
  );
}
