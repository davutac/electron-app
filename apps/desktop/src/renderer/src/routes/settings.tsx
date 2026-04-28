import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "@/components/theme-provider";
import type { Theme } from "@/components/theme-provider";
import Versions from "@/components/versions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  SettingsRow,
  SettingsRowActions,
  SettingsRowContent,
  SettingsRowDescription,
  SettingsRows,
  SettingsRowTitle,
  SettingsSection,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from "@/components/ui/settings";
import { isWebEnvironment } from "@/lib/electron-runtime";

const themeItems = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
] satisfies { label: string; value: Theme }[];

const SettingsRoute = () => {
  const { setTheme, theme } = useTheme();
  const shouldShowVersions = !isWebEnvironment();
  const handleThemeChange = (nextTheme: Theme | null): void => {
    if (!nextTheme) {
      return;
    }

    setTheme(nextTheme);
  };

  return (
    <section aria-labelledby="general-settings-title" className="min-h-full p-6 sm:p-10">
      <Settings>
        <SettingsSection aria-labelledby="general-settings-title">
          <SettingsSectionHeader>
            <SettingsSectionTitle id="general-settings-title">General</SettingsSectionTitle>
          </SettingsSectionHeader>

          <SettingsRows>
            <SettingsRow>
              <SettingsRowContent>
                <SettingsRowTitle id="theme-title">Theme</SettingsRowTitle>
                <SettingsRowDescription id="theme-description">
                  Choose how the app appears
                </SettingsRowDescription>
              </SettingsRowContent>
              <SettingsRowActions>
                <Select items={themeItems} onValueChange={handleThemeChange} value={theme}>
                  <SelectTrigger
                    aria-describedby="theme-description"
                    aria-labelledby="theme-title"
                    className="w-36"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {themeItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </SettingsRowActions>
            </SettingsRow>
          </SettingsRows>
        </SettingsSection>

        {shouldShowVersions ? <Versions /> : null}
      </Settings>
    </section>
  );
};

export const Route = createFileRoute("/settings")({
  component: SettingsRoute,
});
