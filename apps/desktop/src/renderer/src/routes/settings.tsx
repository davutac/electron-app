import { createFileRoute } from "@tanstack/react-router";
import { ModeToggle } from "@/components/mode-toggle";
import Versions from "@/components/versions";
import SettingsUpdateRow from "./-components/settings-update-row";
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
import { hasUpdateApi, isWebEnvironment } from "@/lib/electron-runtime";

const SettingsRoute = () => {
  const shouldShowVersions = !isWebEnvironment();
  const shouldShowUpdates = hasUpdateApi();

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
                <ModeToggle />
              </SettingsRowActions>
            </SettingsRow>
            {shouldShowUpdates ? <SettingsUpdateRow /> : null}
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
