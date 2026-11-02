# Fahim Robot Lab — مختبر فهيم للروبوتات

**Play:** https://nmaaalhawary.github.io/FahimRobotLab/

Offline, bilingual (English / عربي) robotics game for kids. Each mission is a small simulation of a real robot part from the Fahim kit.

| # | Concept | Missions | What the kid discovers |
|---|---------|----------|------------------------|
| 1 | Robot parts | Build-a-Bot Sort | Sense → Think → Act (+ Power) |
| 2 | DC motors & wheels | Straight Line, Around the Wall, Lighthouse Spin | same speed = straight, different = turn, opposite = spin |
| 3 | Servo motors | Balloon Launcher | a servo goes to an exact angle (0–180°); feedback |
| 4 | Gears | Gear Garage (hill, race, heavy load) | small→big = strong/slow, big→small = fast/weak |
| 5 | Distance sensor | Robot Parking, Wall Dodger | thresholds; a moving robot slides before it stops |
| 6 | Line sensors | Line Follower, Speed Challenge | 2-sensor rules; faster robots turn wider |
| 7 | Light sensors | Moth Robot | sensor→motor wiring decides behaviour (Braitenberg vehicle) |

Every chapter opens with a card: a plain explanation, a real-life example, where it appears in the Fahim kit, and a **hands-on teacher activity**.

## Run
No install, no internet. Open `index.html`, or:
```
python3 -m http.server 5205 --bind 127.0.0.1
```

## Files
`data.js` (texts, chapters, missions) · `sim.js` (robot physics, drawing, one mount function per mission type) · `app.js` (screens, progress) · `style.css`
