"use client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
interface Textinputprops{
    placeholder?:string,
    disabled?:boolean,
    isLoading?:boolean,
    maxLength?:number,
    className?:string,
    usermessage?:(value:string)=>void
}
export function Textinput({ 
  placeholder = "Type your message...", 
  disabled = false,
  isLoading = false,
  maxLength = 500,
  className = "",
  usermessage
}:Textinputprops) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e:HTMLFormElement) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isLoading) {
      //Send message from here
      usermessage(message)
      setMessage("");
    }
  };

  const handleKeyDown = (e:any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isDisabled = disabled || isLoading || !message.trim();

  useEffect(() => {
    if (inputRef.current && isFocused) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <div className={`w-full max-w-2xl ${className}`}>
      <div className={`
        bg-background border-2 rounded-xl flex items-center relative
        transition-all duration-200 ease-in-out
        ${isFocused 
          ? 'border-primary shadow-lg shadow-primary/10' 
          : 'border-border hover:border-muted-foreground'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
        <Input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className="
            border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0
            text-base placeholder:text-muted-foreground pr-14 py-4 h-auto min-h-[3rem]
            resize-none
          "
          aria-label="Message input"
        />
        
        <div className="absolute right-2 flex items-center gap-1">
          {message.length > 0 && (
            <span className="text-xs text-muted-foreground mr-2">
              {message.length}/{maxLength}
            </span>
          )}
          
          <Button
            onClick={handleSubmit}
            size="sm"
            disabled={isDisabled}
            className={`
              h-9 w-9 p-0 rounded-lg transition-all duration-200
              ${isDisabled 
                ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105'
              }
            `}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {message.length > maxLength * 0.9 && (
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {maxLength - message.length} characters remaining
        </p>
      )}
    </div>
  );
}