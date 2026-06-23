# DayPass · Tax Residency Tracker — User Manual

## What Is This?

DayPass helps you track how many days you've spent in each country per year. When you approach or exceed a country's tax residency threshold, it alerts you with a passport-style card — **green SAFE**, **gold WATCH**, or **red ALERT**.

All data is stored locally on your device. Nothing is uploaded anywhere. No ads, no sign-up.

---

## Main Screen

The top bar shows the current year with left/right arrows to switch.

### Country Cards

Each added country appears as a "passport card":

- **Top left**: Flag + country name
- **Right stamp**: SAFE / WATCH / ALERT status
- **Large number**: Days accumulated in the current year / threshold
- **Progress bar**: Diagonal stripe fill — the fuller, the closer to threshold
- **Bottom**: Machine-readable zone (MRZ) style code + record count

**Tap a card** to expand and see all entries for that country in the selected year.

### Bottom Buttons

| Button | Position | Purpose |
|--------|----------|---------|
| ⚙️ Gear | Bottom left | Open settings (manage countries, import/export data) |
| ＋ Plus | Bottom right | Add a new entry/exit record |

### Language Switch

Next to the year label in the title bar is a dropdown: **中 / EN**. Switching instantly changes all UI text. Your preference is saved automatically.

---

## Adding an Entry/Exit Record

Tap the **＋** button at bottom right:

1. **Select Country**: Choose from your added countries
2. **Entry Date**: Tap the date row and scroll to pick
3. **Exit Date**: Same as above (hidden when "Still in Country" is ON)
4. **Currently Still in Country**: Turn ON if you haven't left yet — the system uses today's date for calculations
5. Tap **Save**

### Time Overlap Detection

If your new record overlaps with any existing record (more than a single day), a **red banner** appears inside the popup telling you exactly which existing record conflicts.

Exception: Leaving country A and entering country B on the *same day* is allowed — both countries count that day.

---

## Editing / Deleting Records

Expand a country card, then tap any "Entry Stay" record to open the edit popup:
- Modify the date or country, then tap **Save**
- Tap **Delete This Record** to remove it

---

## Settings (⚙️ Gear)

### Countries & Thresholds

- Each country has a days input field on the right — edit to change its tax residency threshold
- Tap the **Del** button to remove the country and all its trip records

### Add New Country

Fill in:
- **Name**: e.g. "USA" or "美国" (supports both languages; flag auto-matches)
- **Emoji** (optional): If left blank, the system auto-matches a flag by name
- **Threshold Days**: The number of days that triggers tax residency

### Data Backup & Restore

- **Export Data**: Save all records as a JSON file
- **Import Data**: Restore from a previously exported JSON file (current data is auto-backed up before overwriting)

---

## Browser Compatibility Tips

- Use **regular mode** (not private/incognito), otherwise data cannot be saved persistently
- If your browser blocks data storage, a red warning banner appears at the top of the page
- For the best experience, **add this app to your home screen** (PWA) for full-screen use

---

## Calculation Logic

- Uses a **single calendar year** model (Jan 1 – Dec 31)
- Same-day double-counting: enter Jan 1, exit Jan 2 = 2 days
- "Still in country" records use today's date as a temporary exit date
- Cross-year trips are automatically split into their respective years

---

## FAQ

**Q: Why did my records disappear after refreshing?**
A: You may be using private/incognito mode, or your browser may be blocking localStorage. Switch to regular mode.

**Q: I shared the link with a friend but they can't see my data?**
A: Data is stored only in your own browser. It does not sync. Use Export/Import to transfer data between devices.

**Q: How many countries can I add?**
A: Unlimited. Built-in flag matching covers 22 countries/regions, and you can add custom countries.

**Q: Which countries' tax rules are supported?**
A: Currently based on physical days in a single calendar year only. Works well for China (183 days), Singapore (183 days), etc. Does not directly support rolling weighted rules like the US Substantial Presence Test.

---

> ⚠️ This tool is for reference only and does not constitute tax advice. Tax residency involves domicile, habitual abode, executive status and other complex factors. Please refer to local tax law and consult a professional tax advisor.
