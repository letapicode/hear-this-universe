
import { useState } from "react";
import { Keyboard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const KeyboardShortcutsHelp = () => {
  const shortcuts = [
    { key: "Space", action: "Play/Pause" },
    { key: "K", action: "Play/Pause" },
    { key: "J", action: "Skip back 15s" },
    { key: "L", action: "Skip forward 15s" },
    { key: "←", action: "Seek backward 5s" },
    { key: "→", action: "Seek forward 5s" },
    { key: "↑", action: "Volume up" },
    { key: "↓", action: "Volume down" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="fixed bottom-4 left-4 glass-morphism border-white/20 hover:bg-white/10 z-40"
        >
          <Keyboard className="h-4 w-4 mr-2" />
          Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-morphism border-white/20 max-w-md">
        <Card className="border-0 bg-transparent">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Keyboard className="h-5 w-5 mr-2" />
              Keyboard Shortcuts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-300">{shortcut.action}</span>
                <kbd className="px-2 py-1 bg-white/10 text-white text-xs rounded border border-white/20">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
            <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-400/20">
              <p className="text-xs text-purple-300">
                💡 Shortcuts work when the audio player is active and you're not typing in a text field.
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsHelp;
