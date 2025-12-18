import { Gender } from "@prisma/client";

export type IDoctorUpdateInput={
    email:string;
    contactNumber:string;
    genger:Gender;
    appointmentFee:number;
    name:string;
    address:string;
    registrationNumber:string;
    experience:number;
    qualification:string;
    currentWorkingPlace:string;
    designation:string;
    isDeleted:boolean;
    specialities:{
        specialityId:string;
        isDeleted?:boolean
    }[]
}