import {
	ActionIcon,
	useComputedColorScheme,
	useMantineColorScheme,
} from "@mantine/core";
import {
	IconMoon,
	IconMoonFilled,
	IconSun,
	IconSunFilled,
} from "@tabler/icons-react";

function DarkModeToggle() {
	const { setColorScheme } = useMantineColorScheme();
	const computedColorScheme = useComputedColorScheme("light", {
		getInitialValueInEffect: true,
	});

	return (
		<ActionIcon
			onClick={() =>
				setColorScheme(computedColorScheme === "light" ? "dark" : "light")
			}
			variant="subtle"
			size="lg"
			aria-label="Toggle color scheme"
			color={"gray"}
		>
			{computedColorScheme === "light" ? <IconMoonFilled /> : <IconSunFilled />}
		</ActionIcon>
	);
}

export default DarkModeToggle;
