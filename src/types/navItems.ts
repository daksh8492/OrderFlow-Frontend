import type {LucideIcon} from "lucide-react"
import type { FieldOfWork } from "../features/users/types/user"

export interface NavItem {
    title: string
    path: string
    icon: LucideIcon
    roles: FieldOfWork[]    
}