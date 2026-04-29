declare module 'is-image-header' {
    interface IsImageResult {
        success: boolean;
        code: number;
        isImage: boolean | null;
    }

    function isImage(url: string): Promise<IsImageResult>;
    export = isImage;
}