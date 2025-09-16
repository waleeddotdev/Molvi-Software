"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


// Renamed props for better clarity when using the component.
function Combobox({ name, items, selectedValue, onValueChange, placeholder = "Select a" }) {
    const [open, setOpen] = React.useState(false)


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between !border !border-border !bg-card hover:text-foreground/80"
                >
                    {selectedValue
                        ? items.find((item) => String(item.id) === String(selectedValue.id) || String(item.id) === selectedValue)?.name
                        : `${placeholder} ${name}...`}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] border-2 border-border p-0">
                <Command>
                    <CommandInput placeholder={`Search ${name}...`} />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    // FIX: The `value` prop must be a string.
                                    value={String(item.id)}
                                    onSelect={(currentValue) => {
                                        // The 'currentValue' from onSelect is the string value from the item.
                                        // It's better to manage state in the parent component.
                                        // This sets the value to the selected ID, or deselects if clicked again.
                                        onValueChange(currentValue === selectedValue ? "" : currentValue)

                                        setOpen(false)
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            // FIX: Compare string with string for the checkmark.
                                            selectedValue === String(item.id) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default Combobox