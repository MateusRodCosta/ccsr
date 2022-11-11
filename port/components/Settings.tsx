import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Drawer,
  FormControlLabel,
  FormGroup,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  FormControl,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Slider,
  Stack,
  Tooltip,
  Typography,
  Divider,
} from "@mui/material";

import IconVolumeOff from "@mui/icons-material/VolumeOff";
import IconVolume from "@mui/icons-material/VolumeUp";
import IconVideo from "@mui/icons-material/PersonalVideo";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GameSettings } from "./App";
import { Game } from "../src/game";

export interface SettingsCallbacks {
  setSmooth: (value: boolean) => void;
  setVolumeTheme: (value: number) => void;
  setVolumeMaster: (value: number) => void;
  setLanguage: (value: string) => void;
}

type SettingsProps = {
  game: Game;
  t: any;
  settings: GameSettings;
  open: boolean;
  cbs: SettingsCallbacks;
  closeCB: () => void;
};

export class Settings extends React.Component<SettingsProps, GameSettings> {
  constructor(props: SettingsProps) {
    super(props);
    this.state = props.settings;
  }

  render(): React.ReactNode {
    const t = this.props.t;
    return (
      <Drawer
        onClose={this.props.closeCB}
        anchor="right"
        open={this.props.open}
      >
        <Stack sx={{ minWidth: 350 }} spacing={0}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <ListItem key="volume" disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <IconVolume />
                  </ListItemIcon>
                  <ListItemText primary={t.volume} />
                </ListItemButton>
              </ListItem>
            </AccordionSummary>
            <AccordionDetails>
              <Typography id="input-slider" gutterBottom>
                {t.music}
              </Typography>
              <Stack
                spacing={2}
                direction="row"
                sx={{ mb: 1 }}
                alignItems="center"
              >
                {this.state.volumeTheme == 0 ? (
                  <IconVolumeOff />
                ) : (
                  <IconVolume />
                )}
                <Slider
                  value={this.state.volumeTheme}
                  onChange={(event, val) => {
                    this.setState({ volumeTheme: val as number }, () => {
                      this.props.cbs.setVolumeTheme(val as number);
                    });
                  }}
                />
                <IconVolume />
              </Stack>

              <Typography id="" gutterBottom>
                {t.sfx}
              </Typography>
              <Stack
                spacing={2}
                direction="row"
                sx={{ mb: 1 }}
                alignItems="center"
              >
                {this.state.volumeMaster == 0 ? (
                  <IconVolumeOff />
                ) : (
                  <IconVolume />
                )}
                <Slider
                  value={this.state.volumeMaster}
                  onChange={(event, val) => {
                    this.setState({ volumeMaster: val as number }, () => {
                      this.props.cbs.setVolumeMaster(val as number);
                    });
                  }}
                />
                <IconVolume />
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <ListItem key="video" disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <IconVideo />
                  </ListItemIcon>
                  <ListItemText primary="Video" />
                </ListItemButton>
              </ListItem>
            </AccordionSummary>
            <AccordionDetails>
              <ListItem disablePadding>
                <FormGroup>
                  <Tooltip arrow title={t["vid.smooth.desc"]}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(event) => {
                            const val = event.target.checked;
                            this.setState({ smoothAnimations: val }, () => {
                              this.props.cbs.setSmooth(event.target.checked);
                            });
                          }}
                          checked={this.state.smoothAnimations}
                        />
                      }
                      label={t["vid.smooth"]}
                    />
                  </Tooltip>
                  <FormControlLabel
                    control={
                      <Checkbox disabled checked={this.state.fullScreen} />
                    }
                    label={t.fitscreen}
                  />
                  <FormControlLabel
                    control={<Checkbox disabled />}
                    label={t.ratio}
                  />
                  <FormControl fullWidth>
                    <InputLabel disabled id="">
                      {t["camera.mode"]}
                    </InputLabel>
                    <Select
                      disabled
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label={t["camera.mode"]}
                      value={10}
                      onChange={undefined}
                    >
                      <MenuItem value={10}>{t["camera.pan"]}</MenuItem>
                      <MenuItem value={20}>Center On Player</MenuItem>
                    </Select>
                  </FormControl>
                </FormGroup>
              </ListItem>
            </AccordionDetails>
          </Accordion>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{t.language}</InputLabel>
            <Select
              IconComponent={() => {
                return <b>hi</b>;
              }}
              value={this.state.language}
              label={t.language}
              onChange={(event) => {
                this.setState({ language: event.target.value }, () => {
                  this.props.cbs.setLanguage(event.target.value);
                });
              }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Español</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Drawer>
    );
  }
}
