import React, { useState, useCallback, useMemo, Fragment } from 'react'
import { CopyCheckIcon, CopyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Hint from './hint';
import CodeView from './code-view';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { convertFilesToTreeFiles } from '@/lib/utils';
import TreeView from './tree-view';

type FileCollection = { [path: string]: string };

function getLanguageFromExtension(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return extension || "text";
}


interface FileBreadCrumbProps {
  filePath: string;
}

const FileBreadCrumb = ({ filePath }: FileBreadCrumbProps) => {
  const pathSegment = filePath.split("/");
  const maxSegments = 4;

  const renderBreadcrunbsItem = () => {
    if (pathSegment.length <= maxSegments) {
      // Show all segment if 4 or less
      return pathSegment.map((segment, index) => {
        const isLast = index === pathSegment.length - 1;
        return (
          <Fragment
            key={index}
          >
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage
                  className='font-medium'
                >
                  {segment}
                </BreadcrumbPage>
              ) : (
                <span
                  className='text-muted-foreground'
                >
                  {segment}
                </span>

              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}

          </Fragment>
        )
      })
    } else {
      const firstSegment = pathSegment[0];
      const lastSegment = pathSegment[pathSegment.length - 1]

      return (
        <Fragment>
          <BreadcrumbItem>
            <span
              className='text-muted-foreground'
            >
              {firstSegment}
            </span>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage
                className='font-medium'
              >
                {lastSegment}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbItem>
        </Fragment>
      )
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {renderBreadcrunbsItem()}
      </BreadcrumbList>
    </Breadcrumb>
  )

}



interface FileExplorerProps {
  files: FileCollection;
}

const FileExplorer = ({ files }: FileExplorerProps) => {
  const [selectFile, setSelectFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null
  });
  const [copied, setCopied] = useState(false)

  const treeData = useMemo(() => {
    return convertFilesToTreeFiles(files)
  }, [files])

  const handleFileSelect = useCallback((
    filePath: string
  ) => {
    console.log(filePath)
    if (files[filePath]) {
      setSelectFile(filePath)
    }

  }, [files])


  const handleCopy = () => {
    if (selectFile) {
      navigator.clipboard.writeText(files[selectFile])
      setCopied(true);
      setTimeout(() => { setCopied(false) }, 2000)
    }

  }


  return (
    <ResizablePanelGroup

    >
      <ResizablePanel
        defaultSize={30}
        minSize={30}
        className='bg-sidebar'
      >
        <TreeView
          data={treeData}
          value={selectFile}
          onSelect={handleFileSelect}
        />
      </ResizablePanel>
      <ResizableHandle
        className='hover:bg-primary transition-colors'
      />
      <ResizablePanel
        defaultSize={70}
        minSize={50}
      >
        {selectFile && files[selectFile] ? (
          <div
            className='h-full w-full flex flex-col'
          >
            <div
              className='border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2 '
            >
              {/** TODO : File BreadCrumb */}
              <FileBreadCrumb
                filePath={selectFile}
              />
              <Hint
                text='copy to clipboard'
                side='bottom'
              >
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className='ml-auto'
                  onClick={handleCopy}
                  disabled={copied}
                >
                  {copied ? <CopyCheckIcon /> : <CopyIcon />}
                </Button>
              </Hint>
            </div>
            <div
              className='flex-1 overflow-auto'
            >
              <CodeView
                code={files[selectFile]}
                lang={getLanguageFromExtension(selectFile)}
              />
            </div>
          </div>
        ) : (
          <div
            className='flex h-full items-center justify-center text-muted-foreground'
          >
            Select a file to view it &apos;s content
          </div>
        )}

      </ResizablePanel>

    </ResizablePanelGroup>
  )
}

export default FileExplorer