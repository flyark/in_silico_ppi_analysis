# FlyPredictome → ChimeraX

Generate [UCSF ChimeraX](https://www.cgl.ucsf.edu/chimerax/) visualization scripts from [FlyPredictome](https://www.flyrnai.org/tools/fly_predictome) interaction data.

## Web Tool (No installation needed)

**[Open the tool](https://flyark.github.io/flypredictome-chimerax/)**

1. Paste a FlyPredictome `famdb_details` URL
2. Choose rank and colors
3. Click **Generate**
4. Download the `.cxc` script and `.pdb` structure file
5. Open the `.cxc` file in ChimeraX

## Color Scheme

| Color | Region | Definition |
|-------|--------|------------|
| Light blue / Light orange | LIR (Local Interaction Region) | PAE ≤ 12 |
| Dark blue / Dark orange | cLIR (contact LIR) | PAE ≤ 12 & Cβ ≤ 8 Å |

Non-LIR regions are hidden. Chain A is shown in blue tones, Chain B in orange tones.

## Local Python Agent (Alternative)

For batch processing or scripting:

```bash
pip install flask

# Command-line agent
python flypredictome_agent.py "https://www.flyrnai.org/tools/fly_predictome/web/famdb_details/Egfr/spi/SET_69/" --rank 1

# Flask web app
python app.py  # → http://127.0.0.1:5000
```

## Metrics

- **iLIS** — integrated Local Interaction Score
- **ipTM** — interface predicted TM-score
- **LIR** — Local Interaction Region (confident domain, PAE ≤ 12)
- **cLIR** — contact LIR (confident interface, PAE ≤ 12 & Cβ distance ≤ 8 Å)

See [AFM-LIS](https://github.com/flyark/AFM-LIS) for metric definitions.

## License

MIT
