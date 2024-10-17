import { MouseEventHandler } from "react";

export interface ContestProps{

    category:string;
    title:string;
    mainPrize:string;
    id:string,
    status: string,
    deadline: string,
    startdate: string,
    description:string,
    entryFee: string,
    linkToThumbnail:string,

  
}

export interface CustomButtonProps{
    title:string;
    containerStyles?:string;
    handleClick?:
    MouseEventHandler<HTMLButtonElement>
    btnType:"button"    |"submit";
    rightIcon?: string;
    isDisabled?:boolean;
}