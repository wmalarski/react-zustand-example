import type { ReactNode } from "react";

export type AsChildProps<
  DefaultElementProps,
  Keys extends keyof DefaultElementProps
> =
  | ({ asChild?: false } & DefaultElementProps)
  | ({ asChild: true; children: ReactNode } & {
      [k in Keys]: DefaultElementProps[k];
    });
