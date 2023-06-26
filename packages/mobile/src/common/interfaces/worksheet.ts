import { ISection } from '@models/day'

export interface IFlatSection extends ISection {
    period: number
    sectionNumber: number
}
