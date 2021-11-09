export type Frame = {
   aspectRatio: number;
   filename: string;
};

export type User = {
   email: string;
   isOwner: boolean;
   booths?: Booth[];
   createdAt: string;
   deletedAt: string | null;
};

export type BreadcrumbLocation = { title: string };

export type CapturedImage = {
   filename: string;
   isPublic: boolean;
   aspectRatio: string;
   slug?: string;
   expired_at?: Date;
};

export type Booth = {
   slug: string;
   starts_at: Date;
   ends_at: Date;
   created_at: Date;
   imagesCount: number;
   images: CapturedImage[];
   isActive: boolean;
   user?: User;
   config: {
      title: string;
      event?: string;
      cameras: { still: boolean; gif: boolean; burst: boolean };
      sharing: { readonly [key: string]: boolean };
      colors: { text: string; background: string };
      images: {
         logo: string | null;
         frames: Frame[];
         background: string | null;
      };
      phrases: [[string, string], [string, string], [string, string]];
   };
};
