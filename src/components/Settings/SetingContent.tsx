export interface SettingFeature {
  name: string;
  toggle?: boolean;
  input?: boolean;
  onClick?: () => void;
}

export interface SettingOption {
  name: "General" | "Account";
  features: SettingFeature[];
}

const SettingContent = ({
  settingOption,
}: {
  settingOption: SettingOption;
}) => {
  return (
    <div>
      <h1>{settingOption.name}</h1>
      {settingOption.features.map((feature, i) => {
        return (
          <div key={i}>
            <h3>{feature.name}</h3>
          </div>
        );
      })}
    </div>
  );
};

export default SettingContent;
