'use strict';
/*global CALC */

/*
 * CALC.scheduler
 */

CALC.scheduler = (function () {
    var that = {},
        nextId = 0,
        frame = 0,
        startMillisecond = (new Date().getTime()),
        head = {
            callback: null,
            frame: -1,
            next: null,
            id: ++nextId
        };


    /*
     * Attach a new event node to the queue
     */
    that.attach = function(callback, delay) {
        var node = head,
            next = null,
            evtFrame = frame + delay;

        if (!callback) return;
        evtFrame = Math.min(evtFrame, frame) + 1;

        while (evtFrame > node.frame && node.next) {
            node = node.next;
        }
        
        next = node.next;
        node.next = {
            callback: callback,
            frame: evtFrame,
            next: next,
            id: ++nextId
        };        
        
        return node.next.id;
    }

    /*
     * Detach the event with the specified id
     */
    that.detach = function(id) {
        var node = head;
        
        while(node.next && node.next.id !== id) {
            node = node.next;
        }

        if (node.next) {
            node.next = node.next.next;
            return true;
        } else {
            return false;
        }
    }
    
    /*
     * Perform all events sheduled for this frame, and increment frame
     */
    that.tick = function() {
        while(head.next && head.next.frame <= frame) {
            head.next.callback();
            head.next = head.next.next;
        }
        frame++;
        
    }
    
    /*
     * Return the current frame
     */
    that.frame = function() {
        return frame;
    };

    /*
     * Return the current millisecond
     */
    that.millisecond = function() {
        return (new Date()).getTime() - startMillisecond;
    }
    

    return that;
    
}());
