export class VacationModel {
    public _id: string; 
    public destination: string;
    public description: string;
    public startDate: string;
    public endDate: string;
    public price: number;
    public imageName: string;
    public image: File;
    public likesCount: number;    
    public isLiked: boolean;
}
