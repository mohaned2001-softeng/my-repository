import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react"
import { useLab } from "@/contexts/LabContext"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type SkillsDialogProps = {
    openDialog: boolean
    setOpenDialog: Dispatch<SetStateAction<boolean>>
}

type Skill = {
    id: string
    name: string
}

export default function SkillsDialog({ openDialog, setOpenDialog }: SkillsDialogProps) {
    const [skills, setSkills] = useState<Skill[]>([
        { id: "network-security", name: "Network Security" },
        { id: "penetration-testing", name: "Penetration Testing" },
        { id: "incident-response", name: "Incident Response" },
    ])
    const [skillName, setSkillName] = useState("")
    const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null)

    const resetForm = () => {
        setSkillName("")
        setSelectedSkillId(null)
    }

    const handleAdd = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const trimmedName = skillName.trim()
        if (!trimmedName) {
            return
        }

        setSkills((previous) => [
            ...previous,
            { id: `${Date.now()}`, name: trimmedName },
        ])
        resetForm()
    }

    const handleUpdate = () => {
        if (!selectedSkillId) {
            return
        }
        const trimmedName = skillName.trim()
        if (!trimmedName) {
            return
        }

        setSkills((previous) =>
            previous.map((skill) =>
                skill.id === selectedSkillId ? { ...skill, name: trimmedName } : skill
            )
        )
        resetForm()
    }

    const handleDelete = () => {
        if (!selectedSkillId) {
            return
        }

        setSkills((previous) => previous.filter((skill) => skill.id !== selectedSkillId))
        resetForm()
    }
    const {setLab , lab} = useLab();
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Manage Skills</DialogTitle>
                    <DialogDescription>
                        Add new skills or update existing ones, then keep the list in sync with your labs.
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-6" onSubmit={handleAdd}>
                    <div className="space-y-2">
                        <Label htmlFor="skill-name">Skill name</Label>
                        <Input
                            id="skill-name"
                            placeholder="e.g. Malware Analysis"
                            value={skillName}
                            onChange={(event) => setSkillName(event.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button type="submit" disabled={!skillName.trim()}>
                            Add
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={!selectedSkillId || !skillName.trim()}
                            onClick={handleUpdate}
                        >
                            Update
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={!selectedSkillId}
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </div>
                </form>
                <div className="rounded-lg border border-border/40">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Skill</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {skills.map((skill) => (
                                <TableRow
                                    key={skill.id}
                                    className={selectedSkillId === skill.id ? "bg-primary/10" : undefined}
                                    onClick={() => {
                                        setSelectedSkillId(skill.id)
                                        setSkillName(skill.name)
                                    }}
                                >
                                    <TableCell className="cursor-pointer font-medium text-foreground">
                                        {skill.name}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}